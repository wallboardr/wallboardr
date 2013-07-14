define([], function () {
  'use strict';
  var indexController = function ($scope) {
    $scope.greeting = 'Colin';
  };
  indexController.$inject = ['$scope'];

  return indexController;
});