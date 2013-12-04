/* global module:false */
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * Wallboardr <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * http://bitbucket.org/colinbate/wallboardr\n' +
        ' * MIT licensed\n' +
        ' *\n' +
        ' * Copyright (C) 2013 Colin Bate, http://colinbate.com\n' +
        ' */\n'
    },
    jshint: {
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        plusplus: true,
        quotmark: true,
        sub: true,
        strict: true,
        undef: true,
        unused: true,
        trailing: true,
        eqnull: true,
        browser: true,
        expr: true,
        globals: {
          define: false,
          require: false,
          module: false
        },
        ignores: ['<%= boardJsFile %>', 'migration.js']
      },
      files: ['*.js', 'public/assets/js/**/*.js']
    },
    less: {
      dev: {
        options: {
          dumpLineNumbers: 'mediaquery'
        },
        files: {
          '<%= adminCssFile %>': 'less/app.less',
          '<%= displayCssFile %>': 'less/display.less'
        }
      },
      clean: {
        files: {
          '<%= adminCssFile %>': 'less/app.less',
          '<%= displayCssFile %>': 'less/display.less'
        }
      }
    },
    watch: {
      less: {
        files: ['less/**/*.less'],
        tasks: 'less:dev'
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      }
    },
    nodemon: {
      options: {
        file: 'index.js',
        ignoredFiles: ['README.md', 'package.json', 'Gruntfile.js', 'node_modules/**', 'public/**', 'spec/**'],
        watchedExtensions: ['js', 'json'],
      },
      dev: {

      }
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    adminCssFile: 'public/assets/css/app.css',
    displayCssFile: 'public/assets/css/display.css',
    boardJsFile: 'public/assets/js/boards.js',
    boardJsSrc: ['public/assets/lib/boards/jquery.js', 'public/assets/lib/boards/bigtext.js', 'public/assets/js/boards/base.js']
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['jshint', 'less:dev', 'concat']);
  grunt.registerTask('work', ['concurrent:target']);
  grunt.registerTask('prep', ['less:clean', 'jshint']);

};