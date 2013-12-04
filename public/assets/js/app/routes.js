define(['controller/index'], function (indexCtrl) {
  'use strict';

  var routes = function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      controller: indexCtrl,
      templateUrl: 'main.html'
    });

    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  };
  routes.$inject = ['$routeProvider', '$locationProvider'];

  return routes;
});