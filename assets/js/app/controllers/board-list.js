define([], function () {
  'use strict';

  var boardListController = function ($scope, $http) {
    $scope.boards = [];
    $scope.activeBoardId = null;

    $scope.loadBoards = function () {
      var url = '/data/boards?sort=_created';
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
        //$scope.cancelAddScreen();
        //$scope.cancelEditScreen();
        //$scope.activeScreen = null;
        //$scope.loadScreens($scope.activeBoard._id);
        //$scope.loadSharedScreens($scope.activeBoard._id);
      }
    };

    $scope.isActiveBoard = function (index) {
      return $scope.activeBoardId && $scope.boards[index] && $scope.activeBoardId === $scope.boards[index]._id;
    };

    $scope.canAddBoard = function () {
      return $scope.$root.user.isAdmin;
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