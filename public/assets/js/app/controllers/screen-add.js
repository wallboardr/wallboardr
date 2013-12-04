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
      $scope.$root.$broadcast('screen:new:close');
    };

    $scope.chooseScreenType = function (plugin) {
      if (plugin === 'shared') {
        $scope.newScreen.type = plugin;
        $scope.newScreen.title = 'Choose a shared screen screen';
        return;
      }
      $scope.newScreen.type = plugin.name;
      $scope.newScreen.title = 'Enter ' + plugin.humanName + ' screen info';
      $scope.newScreen.addUrl = 'assets/plugins/' + plugin.name + '/' + (plugin.addTemplate || 'add.html');
    };

    $scope.addScreen = function (screen) {
      var newScreen;
      if (screen.$valid && $scope.activeBoard) {
        newScreen = angular.copy(screen);
        newScreen.type = $scope.newScreen.type;
        newScreen.board = [$scope.activeBoard.id];
        newScreen.sortkey = {};
        newScreen.sortkey[$scope.activeBoard.id] = nextSortkey;
        newScreen.duration = newScreen.duration || 0;
        $http.post('/screens', newScreen).success(function (data) {
          if (data) {
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