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

    $scope.activeBoard = null;
    $scope.activeScreen = null;
    $scope.newScreen = {};
    resetNewScreen();

    $scope.$on('user:logout', function () {
      $scope.activeBoard = null;
      $scope.activeScreen = null;
      resetNewScreen();
    });

    $scope.$on('user:management:show', function () {
      angular.element(document.body).addClass('occlude');
    });
    $scope.$on('user:management:hide', function () {
      angular.element(document.body).removeClass('occlude');
    });

    $scope.$on('board:selected', function (e, board) {
      $scope.activeBoard = board;
      $scope.cancelAddScreen();
      $scope.cancelEditScreen();
      $scope.activeScreen = null;
    });

    $scope.$on('screen:selected', function (e, scr) {
      $scope.activeScreen = scr;
    });

    $scope.$on('screen:shared:list:loaded', function (e, count) {
      $scope.haveSharedScreens = count > 0;
    });

    $scope.notifyBoardChange = function () {
      var boardId = $scope.activeBoard._id;
      primus.write({updated: boardId});
    };

    $scope.chooseScreenType = function (type) {
      $scope.newScreen.type = type;
      $scope.newScreen.title = 'Enter ' + type + ' screen info';
    };

    $scope.addNewScreen = function () {
      $scope.openNewScreenForm = true;
    };

    $scope.cancelAddScreen = function () {
      $scope.openNewScreenForm = false;
      resetNewScreen();
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
      $scope.cancelAddScreen();
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
          currentBoard = $scope.activeBoard._id,
          key = changedScreen.sortkey,
          url = '/data/screens/_id/' + changedScreen._id;
      window.console.log('Setting screen ' + changedScreen.name + ' to index ' + index);
      if (!angular.isObject(key)) {
        key = {};
      }
      key[currentBoard] = index;
      $http.post(url, {sortkey: key});
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