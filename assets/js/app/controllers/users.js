define([], function () {
  'use strict';
  var usersController = function ($scope, $http, auth) {
    $scope.loginUser = {};

    var goodLogin = function (user) {
      auth.setUser(user);
      $scope.loginUser = {};
    };

    $scope.signin = function (form) {
      if (form.$valid) {
        $http.post('/api/login', $scope.loginUser).success(goodLogin);
      }
    };
  };

  usersController.$inject = ['$scope', '$http', 'auth'];

  return usersController;
});