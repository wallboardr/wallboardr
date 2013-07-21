define([], function () {
  'use strict';
  var usersController = function ($scope, $http) {
    $scope.loginUser = {};

    $scope.signin = function (form) {
      if (form.$valid) {
        $http.post('/api/login', $scope.loginUser);
      }
    };
  };

  usersController.$inject = ['$scope', '$http'];

  return usersController;
});