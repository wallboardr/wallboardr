define(['angular'], function (angular) {
  'use strict';
  var indexController = function ($scope, $http) {
    var resetNewBoard = function (board) {
      $scope.openNewBoardForm = false;
      board.name = '';
      board.slug = '';
      board.desc = '';
      board.duration = '';
    };

    $scope.boards = [];
    $scope.activeBoard = null;
    $scope.activeScreen = null;
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

    $scope.setActiveScreen = function (index) {
      $scope.activeScreen = $scope.screens[index];
    };

    $scope.isActiveScreen = function (index) {
      return $scope.activeScreen && $scope.screens[index] && $scope.activeScreen._id === $scope.screens[index]._id;
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

    var sanitize = function (data) {
      var key, toRemove = [];
      for (key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key[0] === '_') {
          toRemove.push(key);
        }
      }
      for (key = 0; key < toRemove.length; key += 1) {
        delete data[toRemove[key]];
      }
    };

    $scope.updateActiveScreen = function (form) {
      var url = '/data/screens/_id/' + $scope.activeScreen._id,
          toSave;
      if (form.$valid) {
        toSave = angular.copy($scope.activeScreen);
        sanitize(toSave);
        $http.post(url, toSave);
        $scope.openEditScreenForm = false;
      }
    };

    $scope.updateActiveBoard = function (form) {
      var url = '/data/boards/_id/' + $scope.activeBoard._id,
          toSave;
      if (form.$valid) {
        toSave = angular.copy($scope.activeBoard);
        sanitize(toSave);
        $http.post(url, toSave);
        $scope.openEditBoardForm = false;
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