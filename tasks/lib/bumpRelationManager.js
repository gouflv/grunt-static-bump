/**
 * 
 */
var path = require('path')
var fs = require('fs')
var url = require('url')
var querystring = require('querystring')
var walk = require('walkdir')
var _ = require('underscore')
var util = require('./util')

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
			var static_path = rs.src
			var src = replace_static_path(static_path)
			grunt.log.debug('replace_static_path', src)

			mapping[src] = mapping[src] || []
			mapping[src].push({
				page: page,
				href: rs.href,
				hash: rs.hash
			})
		})
	}

	grunt.log.debug('imports mapping', require('util').inspect(mapping))

	return mapping
}

function replace_static_path(src) {
	if(app.setting.__STATICS__)
		return src.replace('__STATICS__', app.setting.__STATICS__)
	else
		return src
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
			src: util.orgin_file_path(current),
			hash: query.md5 || null
		})		
	}

	return matched.length ? matched : null
}
