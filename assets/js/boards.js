/*globals require: false*/
(function () {
    'use strict';
    require.config({
        paths: {
            'lib'        : '../lib/boards',
            'jquery'     : '../lib/boards/jquery',
            'screen'     : '../js/boards/screens'
        },
        shim: {
            'jquery'      : { exports: 'jQuery' },
            'lib/bigtext' : ['jquery']
        }
    });

    require(['boards/base'], function (app) {
        app.bootstrap();
    });
}());