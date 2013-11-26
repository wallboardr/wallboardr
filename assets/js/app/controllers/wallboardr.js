define([], function () {
  'use strict';

  var wallboardrController = function ($scope, auth) {
    $scope.showUserMenu = false;
    $scope.signOut = function () {
      auth.logout().then(function () {
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
      $scope.$broadcast('user:management:show');
      $scope.showAdminMenu = false;
    };
  };
  wallboardrController.$inject = ['$scope', 'auth'];
  wallboardrController.ctrlName = 'WallboardrController';

  return wallboardrController;
});