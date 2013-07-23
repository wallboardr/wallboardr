define([], function () {
  'use strict';
  var usersController = function ($scope, $http, auth) {
    $scope.loginUser = {};

    var goodLogin = function (user) {
      if (user.name) {
        auth.setUser(user);
        $scope.loginUser = {};
      } else {
        $scope.login.serverError = true;
      }
    };

    $scope.signin = function (form) {
      $scope.login.serverError = false;
      $scope.login.clientError = false;
      if (form.$valid) {
        $http.post('/api/login', $scope.loginUser).success(goodLogin);
      } else {
        $scope.login.clientError = true;
      }
    };
  };

  usersController.$inject = ['$scope', '$http', 'auth'];

  return usersController;
});