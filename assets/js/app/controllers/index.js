define(['angular'], function (angular) {
  'use strict';
  var indexController = function ($scope, $http, primus) {
    var resetNewBoard = function (board) {
      $scope.openNewBoardForm = false;
      board.name = '';
      board.slug = '';
      board.desc = '';
      board.duration = '';
    },
    resetNewScreen = function () {
      var ns = $scope.newScreen;
      if (!ns) {
        return;
      }
      ns.type = '';
      ns.title = 'Choose a screen type';
    };

    $scope.boards = [];
    $scope.activeBoard = null;
    $scope.activeScreen = null;
    $scope.screens = [];
    $scope.newScreen = {};
    resetNewScreen();

    $scope.$on('logout', function () {
      $scope.activeScreen = null;
      $scope.activeBoard = null;
      $scope.screens = [];
      resetNewScreen();
    });

    $scope.$on('showUserMgmt', function () {
      angular.element(document.body).addClass('occlude');
    });
    $scope.$on('hideUserMgmt', function () {
      angular.element(document.body).removeClass('occlude');
    });

    $scope.notifyBoardChange = function () {
      var boardId = $scope.activeBoard._id;
      primus.write({updated: boardId});
    };

    $scope.setActiveBoard = function (index) {
      if ($scope.user.loggedIn) {
        $scope.activeBoard = $scope.boards[index];
        $scope.loadScreens($scope.activeBoard._id);
      }
    };

    $scope.loadScreens = function (boardId) {
      var url = '/data/screens/board/' + boardId + '?sort=sortkey';
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

    $scope.chooseScreenType = function (type) {
      $scope.newScreen.type = type;
      $scope.newScreen.title = 'Enter ' + type + ' screen info';
    };

    $scope.cancelAddScreen = function () {
      $scope.openNewScreenForm = false;
      resetNewScreen();
    };

    var cleanForm = function (form) {
      var key;
      for (key in form) {
        if (Object.prototype.hasOwnProperty.call(form, key) && key[0] !== '$') {
          form[key] = '';
        }
      }
    };

    $scope.addScreen = function (screen) {
      var newScreen, sIndex;
      if (screen.$valid && $scope.activeBoard) {
        newScreen = angular.copy(screen);
        newScreen.type = $scope.newScreen.type;
        newScreen.board = $scope.activeBoard._id;
        newScreen.sortkey = $scope.screens.length;
        newScreen.duration = newScreen.duration || 0;
        $http.post('/data/screens', newScreen).success(function (data) {
          if (data && angular.isArray(data)) {
            for (sIndex = 0; sIndex < data.length; sIndex += 1) {
              $scope.screens.push(data[sIndex]);
            }
          }
          cleanForm(screen);
          $scope.openNewScreenForm = false;
          resetNewScreen();
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

    var saveScreenOrder = function (index) {
      var changedScreen = $scope.screens[index],
          url = '/data/screens/_id/' + changedScreen._id;
      window.console.log('Setting screen ' + changedScreen.name + ' to index ' + index);
      $http.post(url, {sortkey: index});
    };

    $scope.moveUp = function (screenIndex) {
      var hold;
      if (screenIndex <= 0) {
        return;
      }
      hold = $scope.screens[screenIndex];
      $scope.screens[screenIndex] = $scope.screens[screenIndex - 1];
      $scope.screens[screenIndex - 1] = hold;
      saveScreenOrder(screenIndex);
      saveScreenOrder(screenIndex - 1);
    };

    $scope.moveDown = function (screenIndex) {
      var hold;
      if (screenIndex >= $scope.screens.length - 1) {
        return;
      }
      hold = $scope.screens[screenIndex];
      $scope.screens[screenIndex] = $scope.screens[screenIndex + 1];
      $scope.screens[screenIndex + 1] = hold;
      saveScreenOrder(screenIndex);
      saveScreenOrder(screenIndex + 1);
    };

    $scope.toggleVisibleScreen = function () {
      var url = '/data/screens/_id/' + $scope.activeScreen._id,
          orig = $scope.activeScreen.disabled;
      $scope.activeScreen.disabled = !orig;
      $http.post(url, {disabled: !orig}).success(function (data) {
        if (data !== '1') {
          $scope.activeScreen.disabled = orig;
        }
      }).error(function () {
        $scope.activeScreen.disabled = orig;
      });
    };

    $scope.updateActiveScreen = function (form) {
      var url = '/data/screens/_id/' + $scope.activeScreen._id,
          backup;
      if (form.$valid) {
        backup = angular.copy($scope.activeScreen);
        angular.extend($scope.activeScreen, $scope.activeScreenEdit);
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
        angular.extend($scope.activeBoard, $scope.activeBoardEdit);
        $http.post(url, $scope.activeBoardEdit).success(function (data) {
          if (data !== '1') {
            revertBoard(data, backup);
          }
        }).error(function (err) {
          revertBoard(err, backup);
        });
        $scope.openEditBoardForm = false;
      }
    };

    $scope.loadBoards = function () {
      var url = '/data/boards?sort=_created';
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
  indexController.$inject = ['$scope', '$http', 'primus'];

  return indexController;
});