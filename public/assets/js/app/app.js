define(
    [
        'angular',
        'controller/loader',
        'app/routes',
        'app/filters',
        'service/auth',
        'service/data-loader',
        'service/primus',
        'angular-cookies'
    ],
    function (angular, ctrlLoader, routes, filters, auth, loader, primus) {
    'use strict';

    var appName = 'wallboardr',
        log = function () {
            var msg = Array.prototype.join.call(arguments, ' ');
            if (window.console) {
                window.console.log(msg);
            }
        },
        init = function (auth) {
            auth.whoAmI();
        };
    init.$inject = ['auth'];
    return {
        bootstrap: function () {
            var app;
            log('Tower, this is Ghost Rider requesting a flyby.');
            app = angular.module(appName, ['ngCookies']);
            app.provider('primus', primus);
            app.config(routes);
            app.filter('nl2br', filters.nl2br);
            app.filter('humanType', filters.humanType);
            app.factory('auth', auth);
            app.factory('dataLoader', loader);
            ctrlLoader(app);
            app.run(init);
            angular.bootstrap(document, [appName]);
            log('Negative Ghost Rider, the pattern is full.');
        }
    };
});