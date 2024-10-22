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
      if ($scope.userCanManageBoard(index) && ($scope.activeBoardId == null || $scope.activeBoardId !== $scope.boards[index].id)) {
        $scope.activeBoardId = $scope.boards[index].id;
        $scope.$root.$broadcast('board:selected', $scope.boards[index]);
      }
    };

    $scope.addBoard = function (board) {
      var newBoard;
      if (board.$valid) {
        newBoard = angular.copy(board);
        $http.post('/boards', newBoard).success(function (data) {
          if (data) {
            $scope.boards.push(data);
          }
        });
        util.cleanForm(board);
        $scope.openNewBoardForm = false;
      }
    };

    $scope.boardState = function (index) {
      var classes = [];
      if ($scope.isActiveBoard(index)) {
        classes.push('is-active');
      }
      if (!$scope.userCanManageBoard(index)) {
        classes.push('forbidden');
      } else {
        if ($scope.user.isEditor) {
          classes.push('highlight');
        }
      }
      return classes;
    };

    $scope.userCanManageBoard = function (index) {
      return $scope.boards[index] && $scope.user.loggedIn &&
        ($scope.user.isAdmin ||
          ($scope.user.isEditor && util.inArray($scope.user.managedBoards, $scope.boards[index].id)));
    };

    $scope.isActiveBoard = function (index) {
      return $scope.activeBoardId && $scope.boards[index] && $scope.activeBoardId === $scope.boards[index].id;
    };

    $scope.canAddBoard = function () {
      return $scope.user.isAdmin;
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