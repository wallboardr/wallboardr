/*globals require: false*/
(function () {
    'use strict';
    require.config({
        paths: {
            'lib'        : '../lib',
            'controller' : 'app/controllers',
            'angular'    : '../lib/angular.min'
        },
        shim: {
            'angular' : { exports: 'angular' }
        }
    });

    require(['app/app'], function (app) {
        app.bootstrap();
    });
}());