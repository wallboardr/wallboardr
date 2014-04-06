define(['lib/datetime-arrays'], function (dta) {
  'use strict';
  var optionalDateDirective = function () {
    var dateRegex = /^(\d{4}-\d\d-\d\d)(?:\s+(\d{1,2}:\d\d(?::\d\d)?\s*(?:[aApP](?:[mM])?)?))?$/,
        prettyDate = function (date) {
          var day = dta.dateArray.toString(dta.dateArray.fromDate(date)),
              time = dta.time.toString(dta.time.fromDate(date));
          return day + ' ' + time;
        },
        parseDate = function (str) {
          var matches = dateRegex.exec(str);
          if (matches === null) {
            return null;
          }
          if (!matches[2]) {
            matches[2] = '00:00';
          } else {
            matches[2] = dta.time.toString(dta.time.fromString(matches[2]));
          }
          return (new Date(matches[1] + ' ' + matches[2]));
        };
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
          return prettyDate(parsed);
        });
        ngModel.$parsers.push(function (value) {
          var parsed;
          if (attrs.wbOptionalDate && attrs.wbOptionalDate === value) {
            ngModel.$setValidity('dateFormat', true);
            return undefined;
          }
          parsed = parseDate(value);
          if (parsed === null) {
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
