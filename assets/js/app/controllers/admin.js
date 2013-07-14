define([], function () {
  'use strict';
  var adminController = function ($scope) {
    $scope.greeting = 'Super Colin';
  };
  adminController.$inject = ['$scope'];

  return adminController;
});