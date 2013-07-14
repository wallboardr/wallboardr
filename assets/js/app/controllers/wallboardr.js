define([], function () {
    'use strict';

    var wallboardrController = function ($scope) {
      $scope.user = {
        name: null,
        loggedIn: false,
        isEditor: false
      };
      $scope.menu = [
          {url: '/admin', label: 'Admin'}
      ];
    };
    wallboardrController.$inject = ['$scope'];

    return wallboardrController;
});