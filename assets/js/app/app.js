define(['angular', 'controller/wallboardr', 'controller/users', 'app/routes', 'app/filters'], function (angular, wallboardrCtrl, userCtrl, routes, filters) {
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
            app.filter('nl2br', filters.nl2br);
            app.controller('WallboardrController', wallboardrCtrl);
            app.controller('UserController', userCtrl);
            angular.bootstrap(document, [appName]);
            log('Negative Ghost Rider, the pattern is full.');
        }
    };
});