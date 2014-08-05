
var path = require('path')
var url = require('url')
var querystring = require('querystring')
var _ = require('underscore')

// var publishFileManager = require('./publishFileManager')
var BumpStat = require('./stat').BumpStat
var bumpRelation = require('./bumpRelationManager')

var cssPubnameRegex = /[^.\/]*_(.{8})\.css/

/**
 * 发布文件
 */
exports.bumpLastVersion = function() {
	
	grunt.log.debug('bumpLastVersion', require('util').inspect(app.files))

	bumpImports()
}

/**
 * 更新发布资源的引用地址
 */
function bumpImports() {
	var imports = bumpRelation.initImportMapping()
	
	app.files.forEach(function(src_file) {
		// 引入资源的页面
		var import_pages = imports[src_file.src]
		if(import_pages) {
			processImportAddress(src_file, import_pages)
		}
	})

	var updated = []
	app.files.forEach(function(src_file) {
		if(src_file.stat == BumpStat.Bumped) {
			updated.push(src_file)
		}
	})
	updated.forEach(function(src_file) {
		grunt.log.write('update', src_file.name, '--->', src_file.hash)
		grunt.log.writeln(' in page', src_file.update_page)
	});
	grunt.log.writeln('updated', updated.length)
}


/**
 * 处理需更新的页面
 */
function processImportAddress(src_file, import_pages) {
	import_pages.forEach(function(imports) {

		var page = imports.page
		var hash = imports.hash
		var src_hash = src_file.hash

		if(hash && src_hash == hash) return

		src_file.stat = BumpStat.Bumped
		src_file.update_page = page

		var html = grunt.file.read(page)
		html = replaceHash(html, imports.href, src_hash)
		grunt.file.write(page, html)
	})
}

function replaceHash(html, href_orgin, hash) {
	var url_params = querystring.parse( url.parse(href_orgin).query )
	url_params.md5 = hash
	
	var href_without_params = href_orgin.split('?')[0]
	var href = href_without_params + '?' + querystring.stringify(url_params)

	html = html.replace(href_orgin, href)
	return html
}

function createBumpFile(src_file) {
	var bump_file = publishFileManager.getPublicPath(src_file)
	grunt.file.copy(src_file.src, bump_file)
	grunt.log.ok('createBumpFile', src_file.src, bump_file)
}
