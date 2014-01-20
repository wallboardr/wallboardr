define([], function () {
  'use strict';

  var wallboardrController = function ($scope, auth, primus) {
    $scope.showUserMenu = false;
    $scope.signOut = function () {
      auth.logout().then(function () {
        $scope.showUserMenu = false;
      });
    };

    $scope.changePassword = function () {
      $scope.$broadcast('user:changepassword:show');
      $scope.showUserMenu = false;
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

    $scope.notifyRefresh = function () {
      primus.write({updated: 'all'});
      $scope.showAdminMenu = false;
    };

    $scope.notifyUpgrade = function () {
      primus.write({upgrade: true});
      $scope.showAdminMenu = false;
    };
  };
  wallboardrController.$inject = ['$scope', 'auth', 'primus'];
  wallboardrController.ctrlName = 'WallboardrController';

  return wallboardrController;
});