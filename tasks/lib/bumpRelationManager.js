/**
 * 
 */
var path = require('path')
var fs = require('fs')
var url = require('url')
var querystring = require('querystring')
var walk = require('walkdir')
var _ = require('underscore')

var view_dir = app.setting.view_dir

var linkRegex = /href="([^"]*\.css[^"]*)"/gi

/**
 * initImportMapping
 * @return {"example.css": {page:"index.html", href:"/public/css/example.css"}}
 */
exports.initImportMapping = function() {
	var imports = {}
	walk.sync(view_dir, function(file) {
		if(path.extname(file) == '.html') {
			var ct = inspectContent(grunt.file.read(file))
			if(ct) {
				imports[file] = ct
			}
		}
	})

	var mapping = {}
	for(page in imports) {
		var importArr = imports[page]

		importArr.forEach(function(rs) {
			mapping[rs.src] = mapping[rs.src] || []
			mapping[rs.src].push({
				page: page,
				href: rs.href,
				hash: rs.hash
			})
		})
	}

	grunt.log.debug('imports mapping', require('util').inspect(mapping))

	return mapping
}

/**
 * 抓取地址
 * @return { href, page, hash }
 */
function inspectContent(html) {
	var matched = []
	var rs;
	while( (rs = linkRegex.exec(html)) ) {

		var query = querystring.parse( url.parse(rs[1]).query ) 
		matched.push({
			href: rs[1],
			src: basename(rs[1]),
			hash: query.md5 || null
		})		
	}
	return matched.length ? matched : null
}

function basename(url) {
    var fname = path.basename(url)
    var urls = fname.split('?')
    if(urls.length >= 2) {
        return urls[0]
    }
    return fname
}