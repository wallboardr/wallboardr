/*globals require: false*/
(function () {
    'use strict';
    require.config({
        paths: {
            'lib'        : '../lib/boards',
            'lib/datetime-arrays' : '../lib/datetime-arrays',
            'jquery'     : '../lib/boards/jquery',
            'spin'       : '../lib/spin.min',
            'screen'     : '../js/boards/screens',
            'primus'     : '../../primus/primus',
            'plugin'     : '../plugins'
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
