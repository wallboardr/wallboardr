define(
    [
        'angular',
        'controller/wallboardr',
        'controller/users',
        'app/routes',
        'app/filters',
        'service/auth',
        'angular-cookies'
    ],
    function (angular, wallboardrCtrl, userCtrl, routes, filters, auth) {
    'use strict';

    var appName = 'wallboardr',
        log = function () {
            var msg = Array.prototype.join.call(arguments, ' ');
            if (window.console) {
                window.console.log(msg);
            }
        },
        init = function (auth) {
            auth.setCookieUser();
        };
    init.$inject = ['auth'];
    return {
        bootstrap: function () {
            var app;
            log('Tower, this is Ghost Rider requesting a flyby.');
            app = angular.module(appName, ['ngCookies']);
            app.config(routes);
            app.filter('nl2br', filters.nl2br);
            app.factory('auth', auth);
            app.controller('WallboardrController', wallboardrCtrl);
            app.controller('UserController', userCtrl);
            app.run(init);
            angular.bootstrap(document, [appName]);
            log('Negative Ghost Rider, the pattern is full.');
        }
    };
});