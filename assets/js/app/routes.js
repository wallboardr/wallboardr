define(['controller/index', 'controller/admin'], function (indexCtrl, adminCtrl) {
  'use strict';

  var routes = function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      controller: indexCtrl,
      templateUrl: 'index'
    });

    $routeProvider.when('/admin', {
      controller: adminCtrl,
      templateUrl: 'admin'
    });

    $routeProvider.when('/view/:board', {
      redirectTo: function (params) {
        window.location = '/view/' + params.board;
      }
    });

    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  };
  routes.$inject = ['$routeProvider', '$locationProvider'];

  return routes;
});