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
        ignores: ['<%= boardJsFile %>']
      },
      files: ['*.js', 'assets/js/**/*.js']
    },
    less: {
      dev: {
        options: {
          dumpLineNumbers: 'mediaquery'
        },
        files: {
          '<%= cssFile %>': 'less/core.less',
          '<%= boardCssFile %>': 'less/board.less'
        }
      },
      clean: {
        files: {
          '<%= boardCssFile %>': 'less/board.less',
          '<%= cssFile %>': 'less/core.less'
        }
      }
    },
    watch: {
      less: {
        files: ['less/*.less'],
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
        ignoredFiles: ['README.md', 'package.json', 'Gruntfile.js', 'node_modules/**', 'sproute/node_modules/**', 'assets/**'],
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
    cssFile: 'assets/css/core.css',
    boardCssFile: 'assets/css/board.css',
    boardJsFile: 'assets/js/boards.js',
    boardJsSrc: ['assets/lib/boards/jquery.js', 'assets/lib/boards/bigtext.js', 'assets/js/boards/base.js']
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['jshint', 'less:dev', 'concat']);
  grunt.registerTask('work', ['concurrent:target']);
  grunt.registerTask('prep', ['jshint', 'less:clean']);

};