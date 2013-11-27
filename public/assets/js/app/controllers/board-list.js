define(['angular', 'app/util'], function (angular, util) {
  'use strict';

  var boardListController = function ($scope, $http) {
    $scope.boards = [];
    $scope.activeBoardId = null;

    $scope.loadBoards = function () {
      var url = '/boards?{"$sort":{"_created":1}}';
      $http.get(url).success(function (data) {
        $scope.boards = data;
      });
    };
    $scope.loadBoards();

    $scope.setActiveBoard = function (index) {
      if (!$scope.boards || !$scope.boards[index]) {
        throw new Error('index - such a board does not exist');
      }
      if ($scope.user.loggedIn && ($scope.activeBoardId == null || $scope.activeBoardId !== $scope.boards[index]._id)) {
        $scope.activeBoardId = $scope.boards[index]._id;
        $scope.$root.$broadcast('board:selected', $scope.boards[index]);
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
        util.cleanForm(board);
        $scope.openNewBoardForm = false;
      }
    };

    $scope.isActiveBoard = function (index) {
      return $scope.activeBoardId && $scope.boards[index] && $scope.activeBoardId === $scope.boards[index]._id;
    };

    $scope.canAddBoard = function () {
      return $scope.$root.user.isAdmin;
    };

    $scope.cancelAddBoard = function () {
      $scope.openNewBoardForm = false;
    };

    $scope.noBoardsAdmin = function () {
      return !$scope.boards.length && $scope.$root.user.isAdmin;
    };

    $scope.noBoardsUser = function () {
      return !$scope.boards.length && !$scope.$root.user.isAdmin;
    };

    $scope.$on('user:logout', function () {
      $scope.activeBoardId = null;
    });

  };
  boardListController.$inject = ['$scope', '$http'];
  boardListController.ctrlName = 'BoardListController';

  return boardListController;
});