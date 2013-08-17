define([], function () {
  'use strict';
  var usersController = function ($scope, $http, auth) {
    $scope.loginUser = {};
    $scope.createUser = {};
    $scope.users = [];

    var goodRegister = function (user) {
      if (user.name) {
        $scope.users.push(user);
        $scope.createUser = {};
      } else {
        $scope.register.serverError = true;
      }
    };

    var goodLogin = function (user) {
      if (user.name) {
        auth.setUser(user);
        $scope.loginUser = {};
      } else {
        $scope.login.serverError = true;
      }
    };

    $scope.findAll = function () {
      var url = '/data/users?sort=name';
      $http.get(url).success(function (data) {
        $scope.users = data;
      });
    };

    $scope.register = function (form) {
      $scope.register.serverError = false;
      $scope.register.clientError = false;
      if (form.$valid) {
        $scope.createUser.role = 'admin';
        $http.post('/api/register', $scope.createUser).success(goodRegister);
        $scope.userFormOpen = false;
      } else {
        $scope.register.clientError = true;
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

    $scope.openUserForm = function (user) {
      $scope.createUser = user;
      $scope.userFormOpen = true;
    };

    $scope.saveUser = function (form) {
      if ($scope.createUser && !$scope.createUser._id) {
        $scope.register(form);
      }
    };

    $scope.closeUserForm = function () {
      $scope.userFormOpen = false;
    };

    $scope.closeMgmt = function () {
      $scope.userMgmtVisible = false;
      $scope.$root.$broadcast('hideUserMgmt');
    };

    $scope.$on('showUserMgmt', function () {
      $scope.findAll();
      $scope.userMgmtVisible = true;
    });
  };

  usersController.$inject = ['$scope', '$http', 'auth'];

  return usersController;
});