define([], function () {
  'use strict';

  var wallboardrController = function ($scope, $http, auth) {
    $scope.showUserMenu = false;
    $scope.signOut = function () {
      $http.get('/api/logout').success(function () {
        auth.resetUser();
        $scope.showUserMenu = false;
      });
    };

    $scope.toggleUserMenu = function () {
      $scope.showAdminMenu = false;
      $scope.showUserMenu = !$scope.showUserMenu;
    };

    $scope.toggleAdminMenu = function () {
      $scope.showUserMenu = false;
      $scope.showAdminMenu = !$scope.showAdminMenu;
    };

    $scope.showUserMgmt = function () {
      $scope.$broadcast('showUserMgmt');
      $scope.showAdminMenu = false;
    };
  };
  wallboardrController.$inject = ['$scope', '$http', 'auth'];

  return wallboardrController;
});