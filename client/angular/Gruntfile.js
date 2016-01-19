/*jslint node: true */
'use strict';

var createFolderGlobs = function(fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules','bower_components','dist','temp','coverage'];
  var fs = require('fs');
  return fs.readdirSync(process.cwd())
      .map(function(file){
        if (ignore.indexOf(file) !== -1 ||
            file.indexOf('.') === 0 ||
            !fs.lstatSync(file).isDirectory()) {
          return null;
        } else {
          return fileTypePatterns.map(function(pattern) {
            return file + '/**/' + pattern;
          });
        }
      })
      .filter(function(patterns){
        return patterns;
      })
      .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001,
            open: true
        }
      }
    },
    watch: {
      main: {
        options: {
          livereload: true,
          livereloadOnError: false,
          spawn: false
        },
        files: [createFolderGlobs(['*.js','*.scss','*.html']),'!_SpecRunner.html','!.grunt'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    }
  });

  grunt.registerTask('serve', ['connect', 'watch']);

};
