/**
 * PublishFileManager
 */
var path = require('path')
var fs = require('fs')
var util = require('./util')

var app = global.app
var cwd = exports.publishDir = app.setting.publish_dir
var srcFiles = app.files

grunt.log.debug('publish dir:', cwd)

exports.publishCssDir = path.join(cwd, 'css')
exports.publishJsDir = path.join(cwd, 'js')
exports.publishJsLibDir = path.join(cwd, 'lib')
exports.publishImgDir = path.join(cwd, 'images')

mkdir(exports.publishDir)
mkdir(exports.publishCssDir)
mkdir(exports.publishJsDir)
mkdir(exports.publishJsLibDir)
mkdir(exports.publishImgDir)

/**
 * 获取发布目录的文件列表
 */
exports.readBumpedList = function() {
	srcFiles.forEach(function(f) {
		if(f.type == 'css') {
			f.bumped = search(exports.publishCssDir, f)
			grunt.log.debug('readBumpedList', require('util').inspect(f.bumped))
		}
	})
	return srcFiles
}

/**
 * 获取文件发布路径
 */
exports.getPublicPath = function(src_file) {
	var dir = path.join(
			app.setting.publish_dir,
			util.detectFileTypeByDir(src_file.src)
		)
	var filepath = path.join(
			dir, 
			exports.getPublicFileName(src_file)
		)
	return filepath
}

/**
 * 获取文件发布文件名
 */
exports.getPublicFileName = function(src_file) {
	var hash = util.fhash(src_file.src)
	return path.basename(src_file.name, src_file.ext) + 
			'_' + hash + 
			src_file.ext
}

/**
 * 检查当前发布的文件是否为最新版
 */
exports.hasLastVersion = function(src_file) {
	var last_file_path = exports.getPublicPath(src_file)
	var has = grunt.file.exists(last_file_path)
	if(!has) return null
	return last_file_path
}

var search = function(dir, src_file) {
	var fnameReg = new RegExp( '^' + path.basename(src_file.name, src_file.ext) + '_(.{8})\\' + src_file.ext + '$' )
	var fileArr = []
	fs.readdirSync(dir).forEach(function(filename) {
		var match = filename.match(fnameReg)
		if(!match) return
		var file = path.join(dir, filename)
		fileArr.push({
			hash: match[1],
			file: path.join(dir, filename),
			date: fs.statSync(file).mtime.getTime()
		})
	})
	return fileArr.sort(function(a, b) {return b.date - a.date })
}

function mkdir(path) {
	if(!grunt.file.exists(path)) {
		grunt.file.mkdir(path)
	}
}

