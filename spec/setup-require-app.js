var requirejs = require('requirejs');

requirejs.config({
  baseUrl: 'assets/js',
  paths: {
    'lib'             : '../lib',
    'controller'      : 'app/controllers',
    'service'         : 'app/services',
    'angular'         : '../lib/angular.min',
    'angular-cookies' : '../lib/angular-cookies'
  },
  shim: {
    'angular'         : { exports: 'angular' },
    'angular-cookies' : ['angular']
  }
});

require = requirejs;
define = requirejs.define;