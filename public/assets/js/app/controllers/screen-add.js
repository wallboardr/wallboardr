define(['angular', 'app/util'], function (angular, util) {
  'use strict';

  var createScreenController = function ($scope, $http) {
    var nextSortkey = 10000,
        resetNewScreen = function () {
          var ns = $scope.newScreen;
          if (!ns) {
            return;
          }
          ns.type = '';
          ns.title = 'Choose a screen type';
        };

    $scope.newScreen = {};
    resetNewScreen();

    $scope.addNewScreen = function () {
      $scope.openNewScreenForm = true;
    };

    $scope.cancelAddScreen = function () {
      $scope.openNewScreenForm = false;
      resetNewScreen();
    };

    $scope.chooseScreenType = function (type) {
      $scope.newScreen.type = type;
      $scope.newScreen.title = 'Enter ' + type + ' screen info';
    };

    $scope.addScreen = function (screen) {
      var newScreen;
      if (screen.$valid && $scope.activeBoard) {
        newScreen = angular.copy(screen);
        newScreen.type = $scope.newScreen.type;
        newScreen.board = [$scope.activeBoard._id];
        newScreen.sortkey = {};
        newScreen.sortkey[$scope.activeBoard._id] = nextSortkey;
        newScreen.duration = newScreen.duration || 0;
        $http.post('/data/screens', newScreen).success(function (data) {
          if (data && angular.isArray(data)) {
            $scope.$root.$broadcast('screen:list:add', data);
          }
          util.cleanForm(screen);
          $scope.cancelAddScreen();
        });
      }
    };

    $scope.$on('user:logout', function () {
      resetNewScreen();
    });

    $scope.$on('board:selected', function () {
      $scope.cancelAddScreen();
    });

    $scope.$on('screen:edit:opened', function () {
      $scope.cancelAddScreen();
    });

    $scope.$on('screen:list:changed', function (e, total) {
      nextSortkey = total;
    });

    $scope.$on('screen:shared:list:changed', function (e, count) {
      $scope.haveSharedScreens = count > 0;
    });

    $scope.$on('screen:new:open', function () {
      $scope.addNewScreen();
    });

  };
  createScreenController.$inject = ['$scope', '$http'];
  createScreenController.ctrlName = 'CreateScreenController';

  return createScreenController;
});