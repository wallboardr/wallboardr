define(['controller/index'], function (indexCtrl) {
  'use strict';

  var routes = function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      controller: indexCtrl,
      templateUrl: 'main.html'
    });

    $routeProvider.when('/view#:board', {
      redirectTo: function (params) {
        window.location = '/view.html#' + params.board;
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