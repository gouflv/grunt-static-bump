/*
 * grunt-static-bump
 * https://github.com/gouflv/grunt-static-bump
 *
 * Copyright (c) 2013 gouflv
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function(grunt) {

	var path = require('path')
	var fs = require('fs')
	var util = require('./lib/util')
	var BumpStat = require('./lib/stat').BumpStat

	var app = {
		files: [],
		setting: {}
	}
	global.app = app
	global.grunt = grunt

	function getSrcFiles(files) {
		files.forEach(function(src) {
			app.files.push({
				src: src,
				name: path.basename(src),
				ext: path.extname(src),
				hash: util.fhash(src),
				stat: BumpStat.Unchanged
			})
		})
		return app.files
	}

	function static_bump() {
		require('./lib/bump').bumpLastVersion()
	}
	
	var DESC = 'bump the static resource in pages'
	grunt.registerMultiTask('static_bump', DESC, function() {
		app.setting = this.options({})
		getSrcFiles(this.filesSrc)
		static_bump()
	})
}
