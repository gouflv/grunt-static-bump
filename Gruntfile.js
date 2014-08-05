/*
 * grunt-static-bump
 * https://github.com/gouflv/grunt-static-bump
 *
 * Copyright (c) 2013 gouflv
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {  
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		view_dir: '/Users/gouflv/Develops/php_project/mbp.com_2014/Application/Home/View/default',
		static_dir: '/Users/gouflv/Develops/php_project/mbp.com_2014/Public/statics',

		static_bump: {
			options: {
				__STATICS__: '<%= static_dir %>',
				view_dir: '<%= view_dir %>'
			},
			css: {
				src: ['<%= static_dir %>/css/**/*.css']
			},
			js: {
				src: ['<%= static_dir %>/dist/*.js']
			}
		}
	});

	grunt.registerTask('default', [
		'static_bump'
	]);

};
