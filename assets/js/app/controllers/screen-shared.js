define(['angular'], function (angular) {
  'use strict';

  var sharedScreenController = function ($scope, $http) {
    var nextSortkey = 10000;
    $scope.sharedScreens = [];

    $scope.loadSharedScreens = function (boardId) {
      var url = '/api/shared/' + boardId;
      $http.get(url).success(function (data) {
        $scope.sharedScreens = data;
        $scope.$root.$broadcast('screen:shared:list:loaded', $scope.sharedScreens.length);
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
          screenId = ss._id,
          url = '/data/screens/_id/' + screenId,
          currentBoard = $scope.activeBoard,
          boardsAndSort = {};
      // Handle legacy data
      upgradeBoardAndSortkey(ss);
      ss.board.push(currentBoard._id);
      ss.sortkey[currentBoard._id] = nextSortkey;
      boardsAndSort.board = ss.board;
      boardsAndSort.sortkey = ss.sortkey;
      $http.post(url, boardsAndSort).success(function (data) {
        if (data === '1') {
          $scope.$root.$broadcast('screen:list:add', ss);
        }
        $scope.cancelAddScreen();
      });
    };

    $scope.$on('board:selected', function (e, board) {
      $scope.loadSharedScreens(board._id);
    });

    $scope.$on('screen:list:loaded', function (e, total) {
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