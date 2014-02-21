define(
    [
        'angular',
        'controller/loader',
        'app/routes',
        'app/filters',
        'service/auth',
        'service/data-loader',
        'service/primus',
        'service/notifier',
        'app/plugin-manager',
        'angular-route'
    ],
    function (angular, ctrlLoader, routes, filters, auth, loader, primus, notifier, plugins) {
    'use strict';

    var appName = 'wallboardr',
        log = function () {
            var msg = Array.prototype.join.call(arguments, ' ');
            if (window.console) {
                window.console.log(msg);
            }
        },
        init = function (auth, pluginMgr) {
            auth.loadUser();
            pluginMgr.register();
        };
    init.$inject = ['auth', 'pluginMgr'];
    return {
        bootstrap: function () {
            var app;
            log('Tower, this is Ghost Rider requesting a flyby.');
            app = angular.module(appName, ['ngRoute']);
            app.provider('primus', primus);
            app.config(routes);
            app.filter('nl2br', filters.nl2br);
            app.filter('humanType', filters.humanType);
            app.filter('titleCase', filters.titleCase);
            app.factory('auth', auth);
            app.factory('dataLoader', loader);
            app.factory('notifier', notifier);
            ctrlLoader(app);
            plugins(app);
            app.factory('pluginMgr', plugins.service);
            app.run(init);
            angular.bootstrap(document, [appName]);
            log('Negative Ghost Rider, the pattern is full.');
        }
    };
});