define([], function () {
  'use strict';
  var checkboxDirective = function () {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        boxId: '@',
        value: '='
      },
      templateUrl: 'assets/partial/checkbox.html'
    };
  };
  checkboxDirective.dirName = 'cbCheckbox';
  return checkboxDirective;
});