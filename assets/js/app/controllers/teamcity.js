define([], function () {
  'use strict';
  var teamcityController = function ($scope, dataLoader) {
    $scope.reset = function () {
      $scope.projects = [];
      $scope.tcUrl = '';
    }
    $scope.reset();

  };
  teamcityController.$inject = ['$scope', 'dataLoader'];
});