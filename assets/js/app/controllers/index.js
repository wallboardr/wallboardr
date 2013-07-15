define(['angular'], function (angular) {
  'use strict';
  var indexController = function ($scope, $http) {
    var resetNewBoard = function (board) {
      board.name = '';
      board.slug = '';
      board.desc = '';
      board.duration = '';
    };

    $scope.greeting = 'Colin';
    $scope.boards = [];

    $scope.loadBoards = function () {
      var url = '/data/boards';
      $http.get(url).success(function (data) {
        $scope.boards = data;
      });
    };
    $scope.loadBoards();

    $scope.addBoard = function (board) {
      var newBoard, bIndex;
      if (board.$valid) {
        newBoard = angular.copy(board);
        $http.post('/data/boards', newBoard).success(function (data) {
          if (data && angular.isArray(data)) {
            for (bIndex = 0; bIndex < data.length; bIndex += 1) {
              $scope.boards.push(data[bIndex]);
            }
          }
        });
        resetNewBoard(board);
      }
    };
  };
  indexController.$inject = ['$scope', '$http'];

  return indexController;
});