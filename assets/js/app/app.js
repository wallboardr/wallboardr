define(['angular', 'controller/wallboardr', 'app/routes'], function (angular, wallboardrCtrl, routes) {
    'use strict';

    var appName = 'wallboardr',
        log = function () {
            var msg = Array.prototype.join.call(arguments, ' ');
            if (window.console) {
                window.console.log(msg);
            }
        };

    return {
        bootstrap: function () {
            var app;
            log('Tower, this is Ghost Rider requesting a flyby.');
            app = angular.module(appName, []);
            app.config(routes);
            app.controller('WallboardrController', wallboardrCtrl);
            angular.bootstrap(document, [appName]);
            log('Negative Ghost Rider, the pattern is full.');
        }
    };
});