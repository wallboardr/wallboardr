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
    };
    wallboardrController.$inject = ['$scope', '$http', 'auth'];

    return wallboardrController;
});