define([], function () {
    'use strict';

    var wallboardrController = function ($scope) {
      
      $scope.menu = [
          {url: '/admin', label: 'Admin'}
      ];
    };
    wallboardrController.$inject = ['$scope'];

    return wallboardrController;
});