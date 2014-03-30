/*globals require: false*/
(function () {
    'use strict';
    require.config({
        paths: {
            'lib'             : '../lib',
            'controller'      : 'app/controllers',
            'service'         : 'app/services',
            'directives'      : 'app/directives',
            'angular'         : '../lib/angular.min',
            'angular-route'   : '../lib/angular-route.min',
            'primus'          : '../../primus/primus',
            'plugin'          : '../plugins'
        },
        shim: {
            'angular'         : { exports: 'angular' },
            'angular-route'   : ['angular']
        }
    });

    require(['app/app'], function (app) {
        app.bootstrap();
    });
}());