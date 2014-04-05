define(['lib/datetime-arrays'], function (dta) {
  'use strict';
  var timeDirective = function () {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var errorKey = 'timeFormat';
        if (!ngModel) {
          return;
        }
        ngModel.$formatters.push(function (value) {
          var valid = dta.time.isValid(value);
          ngModel.$setValidity(errorKey, valid);
          return valid ? dta.time.toString(value) : undefined;
        });
        ngModel.$parsers.push(function (value) {
          var parsed = dta.time.fromString(value);
          ngModel.$setValidity(errorKey, parsed !== null);
          return parsed || undefined;
        });
      }
    };
  };
  timeDirective.dirName = 'wbTime';
  return timeDirective;
});
