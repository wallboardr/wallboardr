/*globals require: false*/
(function () {
    'use strict';
    require.config({
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

    require(['app/app'], function (app) {
        app.bootstrap();
    });
}());