define([], function () {
  'use strict';
  var optionalDateDirective = function () {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        ngModel.$formatters.push(function (value) {
          var parsed;
          if ((typeof value === 'undefined' || value === null) && attrs.wbOptionalDate) {
            return attrs.wbOptionalDate;
          }
          parsed = new Date(value);
          if (isNaN(parsed.getDate())) {
            ngModel.$setValidity('dateFormat', false);
            return undefined;
          }
          ngModel.$setValidity('dateFormat', true);
          return parsed.toString();
        });
        ngModel.$parsers.push(function (value) {
          var parsed;
          if (attrs.wbOptionalDate && attrs.wbOptionalDate === value) {
            ngModel.$setValidity('dateFormat', true);
            return undefined;
          }
          parsed = new Date(value);
          if (isNaN(parsed.getDate())) {
            ngModel.$setValidity('dateFormat', false);
            return undefined;
          }
          ngModel.$setValidity('dateFormat', true);
          return parsed.getTime();
        });
      }
    };
  };
  optionalDateDirective.dirName = 'wbOptionalDate';
  return optionalDateDirective;
});
