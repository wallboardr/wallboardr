define([], function () {
  'use strict';
  var usersController = function ($scope, $http, auth) {
    $scope.loginUser = {};
    $scope.createUser = {};
    $scope.changePwd = {};
    $scope.users = [];

    var goodRegister = function (user) {
      if (user.username) {
        $scope.users.push(user);
        $scope.createUser = {};
      } else {
        $scope.register.serverError = true;
      }
    };

    var goodLogin = function (user) {
      if (user) {
        $scope.loginUser = {};
      } else {
        $scope.login.serverError = true;
      }
    };

    var badLogin = function () {
      $scope.login.serverError = true;
    };

    $scope.findAll = function () {
      var url = '/users?{"$sort":{"username":1}}';
      $http.get(url).success(function (data) {
        $scope.users = data;
      });
    };

    $scope.register = function (form) {
      $scope.register.serverError = false;
      $scope.register.clientError = false;
      if (form.$valid) {
        auth.registerAdmin($scope.createUser).success(goodRegister);
        $scope.userFormOpen = false;
      } else {
        $scope.register.clientError = true;
      }
    };

    $scope.signin = function (form) {
      $scope.login.serverError = false;
      $scope.login.clientError = false;
      if (form.$valid) {
        auth.login($scope.loginUser).then(goodLogin, badLogin);
      } else {
        $scope.login.clientError = true;
      }
    };

    $scope.openUserForm = function (user) {
      $scope.createUser = user;
      $scope.userFormOpen = true;
    };

    $scope.saveUser = function (form) {
      if ($scope.createUser && !$scope.createUser.id) {
        $scope.register(form);
      }
    };

    $scope.changePwdState = function () {
      var classes = [];
      if ($scope.changePwd.attempted) {
        classes.push('attempt');
      }
      return classes;
    };

    $scope.pwdState = function () {
      var classes = [];
      if ($scope.changePwd.password === $scope.changePwd.repasswd) {
        classes.push('match');
      } else {
        classes.push('nomatch');
      }
      return classes;
    };

    $scope.savePassword = function () {
      if ($scope.changePwd.password === $scope.changePwd.repasswd) {
        auth.changePassword($scope.user.id, $scope.changePwd.password).then(function () {
          $scope.closeChangePwd();
        });
      } else {
        $scope.changePwd.attempted = true;
      }
    };

    $scope.closeUserForm = function () {
      $scope.userFormOpen = false;
    };

    $scope.closeChangePwd = function () {
      $scope.changePwd = {};
      $scope.changePasswordOpen = false;
      $scope.userMgmtVisible = false;
      $scope.changePwdForm.$setPristine();
      $scope.$root.$broadcast('user:management:hide');
    };

    $scope.closeMgmt = function () {
      $scope.userMgmtVisible = false;
      $scope.$root.$broadcast('user:management:hide');
    };

    $scope.$on('user:management:show', function () {
      $scope.findAll();
      $scope.userMgmtVisible = true;
    });

    $scope.$on('user:changepassword:show', function () {
      $scope.userMgmtVisible = true;
      $scope.changePasswordOpen = true;
    });
  };

  usersController.$inject = ['$scope', '$http', 'auth'];
  usersController.ctrlName = 'UserController';

  return usersController;
});