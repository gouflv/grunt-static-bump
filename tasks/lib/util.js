var path = require('path')
var fs = require('fs')

exports.detectFileTypeByDir = function(filepath) {
	var dir = path.dirname(filepath)
	return dir.split(path.sep).pop()
}

exports.fhash = function(filepath) {
	var md5 = require('MD5')
	return md5(fs.readFileSync(filepath)).substr(0, 8)
}
