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

var rlink = /href="([^"]*\.css[^"]*)"|src="([^"]*\.js[^"]*)"/gi

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
	while( (rs = rlink.exec(html)) ) {

		var current = rs[1] || rs[2]

		var query = querystring.parse( url.parse(current).query ) 
		matched.push({
			href: current,
			src: basename(current),
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