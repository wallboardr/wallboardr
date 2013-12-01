/*globals require: false*/
(function () {
    'use strict';
    require.config({
        paths: {
            'lib'             : '../lib',
            'controller'      : 'app/controllers',
            'service'         : 'app/services',
            'angular'         : '../lib/angular.min',
            'primus'          : '../../primus/primus',
            'plugin'         : '../plugins'
        },
        shim: {
            'angular'         : { exports: 'angular' }
        }
    });

    require(['app/app'], function (app) {
        app.bootstrap();
    });
}());