define(['teamcity-api'], function (Teamcity) {
  'use strict';
  var teamcityController = function ($scope, dataLoader) {
    var tcApi;
    $scope.reset = function () {
      $scope.projects = [];
      $scope.tcUrl = '';
    };
    $scope.connectToTeamcity = function () {
        if ($scope.url) {
            tcApi = new Teamcity($scope.url, dataLoader);
        }
    };
    $scope.reset();

  };
  teamcityController.$inject = ['$scope', 'dataLoader'];
});