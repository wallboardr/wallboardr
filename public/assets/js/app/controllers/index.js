define(['angular', 'app/util'], function (angular, util) {
  'use strict';
  var indexController = function ($scope, $http, primus) {

    var showOverlay = function () {
          angular.element(document.body).addClass('occlude');
        },
        hideOverlay = function () {
          angular.element(document.body).removeClass('occlude');
        };

    $scope.activeBoard = null;
    $scope.activeScreen = null;

    // ------ Handle user related stuff ------------------------------------

    $scope.$on('user:logout', function () {
      $scope.activeBoard = null;
      $scope.activeScreen = null;
    });

    $scope.$on('user:management:show', showOverlay);
    $scope.$on('user:management:hide', hideOverlay);

    // ------ Handle board related stuff ------------------------------------

    $scope.$on('board:selected', function (e, board) {
      $scope.activeBoard = board;
      $scope.cancelEditScreen();
      $scope.activeScreen = null;
    });

    $scope.notifyBoardChange = function () {
      var boardId = $scope.activeBoard.id;
      primus.write({updated: boardId});
    };

    $scope.startEditingBoard = function () {
      $scope.activeBoardEdit = angular.copy($scope.activeBoard);
      util.sanitize($scope.activeBoardEdit);
      $scope.openEditBoardForm = true;
    };

    $scope.cancelEditBoard = function () {
      $scope.activeBoardEdit = {};
      $scope.openEditBoardForm = false;
    };

    $scope.updateActiveBoard = function (form) {
      var url = '/boards/' + $scope.activeBoard.id,
          backup;
      if (form.$valid) {
        backup = angular.copy($scope.activeBoard);
        angular.extend($scope.activeBoard, $scope.activeBoardEdit);
        $http.post(url, $scope.activeBoardEdit).error(function (err) {
          revertBoard(err, backup);
        });
        $scope.openEditBoardForm = false;
      }
    };

    // ------ Handle screen related stuff ------------------------------------

    $scope.$on('screen:selected', function (e, scr) {
      $scope.activeScreen = scr;
    });

    $scope.$on('screen:deselected', function () {
      $scope.cancelEditScreen();
      $scope.activeScreen = null;
    });

    $scope.$on('screen:new:open', showOverlay);
    $scope.$on('screen:new:close', hideOverlay);

    $scope.startEditingScreen = function () {
      $scope.activeScreenEdit = angular.copy($scope.activeScreen);
      util.sanitize($scope.activeScreenEdit);
      $scope.openEditScreenForm = true;
      $scope.$root.$broadcast('screen:edit:opened');
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

    $scope.isMultiLinkedScreen = function () {
      // Removing an unlinked screen requires a recent browser with array.indexOf
      return $scope.activeScreen && util.multiLinked($scope.activeScreen) && Array.prototype.indexOf;
    };

    $scope.unlinkScreen = function () {
      $scope.$root.$broadcast('screen:shared:unlink', $scope.activeScreen, $scope.activeBoard.id);
    };

    $scope.toggleVisibleScreen = function () {
      var url = '/screens/' + $scope.activeScreen.id,
          orig = $scope.activeScreen.disabled;
      $scope.activeScreen.disabled = !orig;
      $http.post(url, {disabled: !orig}).success(function (data) {
        if (data) {
          $scope.activeScreen.disabled = data.disabled;
        } else {
          $scope.activeScreen.disabled = orig;
        }
      }).error(function () {
        $scope.activeScreen.disabled = orig;
      });
    };

    $scope.updateActiveScreen = function (form) {
      var url = '/screens/' + $scope.activeScreen.id,
          backup;
      if (form.$valid) {
        backup = angular.copy($scope.activeScreen);
        angular.extend($scope.activeScreen, $scope.activeScreenEdit);
        $http.post(url, $scope.activeScreenEdit).error(function (err) {
          revertScreen(err, backup);
        });
        $scope.openEditScreenForm = false;
      }
    };

  };
  indexController.$inject = ['$scope', '$http', 'primus'];

  return indexController;
});