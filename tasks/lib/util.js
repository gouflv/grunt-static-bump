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

exports.orgin_file_path = function(fname) {
    var urls = fname.split('?')
    if(urls.length >= 2) {
        return urls[0]
    }
    return fname
}
