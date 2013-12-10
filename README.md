# grunt-static-bump

> 静态资源版本更新

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-bump --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-bump');
```

## The "static_bump" task

### Overview
In your project's Gruntfile, add a section named `static_bump` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  static_bump: {
		options: {
			view_dir: 'ViewDir'
		},
		css: {
			src: ['/Users/gouflv/Develops/php_project/mbp.com/Public/static/public/css/*.css']
		},
		js: {
			src: ['/Users/gouflv/Develops/php_project/mbp.com/Public/static/public/js/*.js']
	  }
  }
});
```

### Options


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
