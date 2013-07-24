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
    $scope.createScreenTab = 'local';

    $scope.$on('logout', function () {
      $scope.activeScreen = null;
      $scope.activeBoard = null;
      $scope.screens = [];
      $scope.createScreenTab = 'local';
    });

    $scope.setActiveBoard = function (index) {
      if ($scope.user.loggedIn) {
        $scope.activeBoard = $scope.boards[index];
        $scope.loadScreens($scope.activeBoard._id);
      }
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
        newScreen.type = $scope.createScreenTab;
        newScreen.board = $scope.activeBoard._id;
        $http.post('/data/screens', newScreen).success(function (data) {
          if (data && angular.isArray(data)) {
            for (sIndex = 0; sIndex < data.length; sIndex += 1) {
              $scope.screens.push(data[sIndex]);
            }
          }
          screen.name = screen.duration = screen.message = screen.url = screen.selector = '';
          $scope.openNewScreenForm = false;
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

    $scope.startEditingBoard = function () {
      $scope.activeBoardEdit = angular.copy($scope.activeBoard);
      sanitize($scope.activeBoardEdit);
      $scope.openEditBoardForm = true;
    };

    $scope.cancelEditBoard = function () {
      $scope.activeBoardEdit = {};
      $scope.openEditBoardForm = false;
    };

    $scope.startEditingScreen = function () {
      $scope.activeScreenEdit = angular.copy($scope.activeScreen);
      sanitize($scope.activeScreenEdit);
      $scope.openEditScreenForm = true;
    };

    $scope.cancelEditScreen = function () {
      $scope.activeScreenEdit = {};
      $scope.openEditScreenForm = false;
    };

    var revertBoard = function (err, backup) {
      angular.copy(backup, $scope.activeBoard);
    };

    var revertScreen = function (err, backup) {
      angular.copy(backup, $scope.activeScreen);
    };

    $scope.updateActiveScreen = function (form) {
      var url = '/data/screens/_id/' + $scope.activeScreen._id,
          backup;
      if (form.$valid) {
        backup = angular.copy($scope.activeScreen);
        angular.copy($scope.activeScreenEdit, $scope.activeScreen);
        $http.post(url, $scope.activeScreenEdit).success(function (data) {
          if (data !== '1') {
            revertScreen(data, backup);
          }
        }).error(function (err) {
          revertScreen(err, backup);
        });
        $scope.openEditScreenForm = false;
      }
    };

    $scope.updateActiveBoard = function (form) {
      var url = '/data/boards/_id/' + $scope.activeBoard._id,
          backup;
      if (form.$valid) {
        backup = angular.copy($scope.activeBoard);
        angular.copy($scope.activeBoardEdit, $scope.activeBoard);
        $http.post(url, $scope.activeBoardEdit).success(function (data) {
          if (data !== '1') {
            revertBoard(data, backup);
          }
        }).error(function (err) {
          revertScreen(err, backup);
        });
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