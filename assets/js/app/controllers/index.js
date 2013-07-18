define(['angular'], function (angular) {
  'use strict';
  var indexController = function ($scope, $http) {
    var resetNewBoard = function (board) {
      board.name = '';
      board.slug = '';
      board.desc = '';
      board.duration = '';
    };

    $scope.boards = [];
    $scope.activeBoard = null;
    $scope.screens = [];

    $scope.setActiveBoard = function (index) {
      $scope.activeBoard = $scope.boards[index];
      $scope.loadScreens($scope.activeBoard._id);
    };

    $scope.loadScreens = function (boardId) {
      var url = '/data/screens/board/' + boardId;
      $http.get(url).success(function (data) {
        $scope.screens = data;
      });
    };

    $scope.isActiveBoard = function (index) {
      return $scope.activeBoard && $scope.boards[index] && $scope.activeBoard._id === $scope.boards[index]._id;
    };

    $scope.addScreen = function (screen) {
      var newScreen, sIndex;
      if (screen.$valid && $scope.activeBoard) {
        newScreen = angular.copy(screen);
        newScreen.type = 'local';
        newScreen.board = $scope.activeBoard._id;
        $http.post('/data/screens', newScreen).success(function (data) {
          if (data && angular.isArray(data)) {
            for (sIndex = 0; sIndex < data.length; sIndex += 1) {
              $scope.screens.push(data[sIndex]);
            }
          }
          screen.name = screen.duration = screen.message = '';
        });
      }
    };

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