define(['angular'], function (angular) {
  'use strict';

  var screenListController = function ($scope, $http) {
    $scope.screens = [];
    $scope.activeScreenId = null;

    $scope.loadScreens = function (boardId) {
      var url = '/data/screens/board/' + boardId + '?sort=sortkey.' + boardId;
      $http.get(url).success(function (data) {
        $scope.screens = data;
        $scope.$root.$broadcast('screen:list:changed', $scope.screens.length);
      });
    };

    $scope.setActiveScreen = function (index) {
      if (!$scope.screens || !$scope.screens[index]) {
        throw new Error('index - such a screen does not exist');
      }
      if ($scope.activeScreenId == null || $scope.activeScreenId !== $scope.screens[index]._id) {
        $scope.cancelEditScreen();
        $scope.activeScreenId = $scope.screens[index]._id;
        $scope.$root.$broadcast('screen:selected', $scope.screens[index]);
      }
    };

    $scope.screenStateClass = function (scr) {
      var classes = [];
      //'is-active': isActiveScreen($index), 'is-disabled': screen.disabled, 'is-shared': screen.shareable
      if (scr) {
        if ($scope.activeScreenId && scr._id === $scope.activeScreenId) {
          classes.push('is-active');
        }
        if (scr.disabled) {
          classes.push('is-disabled');
        }
        if (scr.shareable) {
          classes.push('is-shareable');
        }
        if (angular.isArray(scr.board) && scr.board.length > 1) {
          classes.push('is-shared');
        }
      }
      return classes;
    };

    var saveScreenOrder = function (index) {
      var changedScreen = $scope.screens[index],
          currentBoard = $scope.activeBoardId,
          key = changedScreen.sortkey,
          url = '/data/screens/_id/' + changedScreen._id;
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

    $scope.addNewScreen = function () {
      $scope.$root.$broadcast('screen:new:open');
    };

    $scope.$on('screen:list:add', function (e, scr) {
      var sIndex;
      if (!scr) {
        return;
      }
      if (angular.isArray(scr)) {
        for (sIndex = 0; sIndex < scr.length; sIndex += 1) {
          $scope.screens.push(scr[sIndex]);
        }
      } else {
        $scope.screens.push(scr);
      }
      $scope.$root.$broadcast('screen:list:changed', $scope.screens.length);
    });

    $scope.$on('board:selected', function (e, board) {
      $scope.loadScreens(board._id);
    });

    $scope.$on('user:logout', function () {
      $scope.activeScreenId = null;
      $scope.screens = [];
    });
  };
  screenListController.$inject = ['$scope', '$http'];
  screenListController.ctrlName = 'ScreenListController';

  return screenListController;
});