define(['angular'], function (angular) {
  'use strict';

  var sharedScreenController = function ($scope, $http) {
    var nextSortkey = 10000;
    $scope.sharedScreens = [];

    $scope.loadSharedScreens = function (boardId) {
      var url = '/api/shared/' + boardId;
      $http.get(url).success(function (data) {
        $scope.sharedScreens = data;
        $scope.$root.$broadcast('screen:shared:list:changed', $scope.sharedScreens.length);
      });
    };

    var upgradeBoardAndSortkey = function (scr) {
      var oldsort;
      if (!angular.isObject(scr.sortkey)) {
        // Shouldn't have a screen with old sort and new boards.
        oldsort = scr.sortkey;
        scr.sortkey = {};
        scr.sortkey[scr.board] = oldsort;
      }
      if (!angular.isArray(scr.board)) {
        scr.board = [scr.board];
      }
    };

    $scope.addSharedScreen = function (index) {
      var ss = $scope.sharedScreens[index],
          screenId = ss.id,
          url = '/screens/' + screenId,
          currentBoard = $scope.activeBoard,
          boardsAndSort = {};
      // Handle legacy data
      upgradeBoardAndSortkey(ss);
      ss.board.push(currentBoard.id);
      ss.sortkey[currentBoard.id] = nextSortkey;
      boardsAndSort.board = ss.board;
      boardsAndSort.sortkey = ss.sortkey;
      $http.post(url, boardsAndSort).success(function (data) {
        if (data) {
          $scope.sharedScreens.splice(index, 1);
          $scope.$root.$broadcast('screen:list:add', ss);
          $scope.$root.$broadcast('screen:shared:list:changed', $scope.sharedScreens.length);
        }
        $scope.cancelAddScreen();
      });
    };

    $scope.unlinkScreen = function (scr, boardId) {
      var bIndex = scr.board.indexOf(boardId),
          url = '/screens/' + scr.id,
          boardsAndSort = {};

      if (bIndex < 0) {
        throw new Error('Board does not contain this screen!');
      }
      scr.board.splice(bIndex, 1);
      delete scr.sortkey[boardId];
      boardsAndSort.board = scr.board;
      boardsAndSort.sortkey = scr.sortkey;
      $http.post(url, boardsAndSort).success(function (data) {
        if (data) {
          if (scr.shareable) {
            $scope.sharedScreens.push(scr);
          }
          $scope.$root.$broadcast('screen:list:remove', true);
          $scope.$root.$broadcast('screen:shared:list:changed', $scope.sharedScreens.length);
        }
      });

    };

    $scope.$on('board:selected', function (e, board) {
      $scope.loadSharedScreens(board.id);
    });

    $scope.$on('screen:shared:unlink', function (e, scr, boardId) {
      $scope.unlinkScreen(scr, boardId || $scope.activeBoard.id);
    });

    $scope.$on('screen:list:changed', function (e, total) {
      nextSortkey = total;
    });

    $scope.$on('user:logout', function () {
      $scope.sharedScreens = [];
    });
  };
  sharedScreenController.$inject = ['$scope', '$http'];
  sharedScreenController.ctrlName = 'SharedScreenController';

  return sharedScreenController;
});