(function(root, factory) {
  /* CommonJS */
  if (typeof exports == 'object') {
    module.exports = factory();
  }
  /* AMD module */
  else if (typeof define == 'function' && define.amd) {
    define(factory);
  }
  /* Browser global */
  else {
    root.datetimeArrays = factory();
  }
}
(this, function() {
  'use strict';
  /*
  Time   := [Hour, Min, Second]
  Date   := [Year, Month, Day]
  Hour   := 0..23
  Min    := 0..59
  Second := 0..59
  Year   := 1..9999
  Month  := 1..12
  Day    := 1..31
  */
  var something = null,
      pad = function (value, digits, padder) {
        var str = value + '';
        padder = padder || '0';
        digits = digits || 2;
        while (digits > str.length) {
          str = padder + str;
        }
        return str;
      },
      timeRegex = /^(\d{1,2}):(\d\d)(:(\d\d))?\s*(([aApP])([mM])?)?$/,
      jsDate = function (date) {
        return Object.prototype.toString.call(date) === '[object Date]' ? date : new Date(date);
      },
      validateTime = function (time) {
        if (!time) {
          return false;
        }
        return time[0] >= 0 && time[0] <= 23 && time[1] >= 0 && time[1] <= 59 && time[2] >= 0 && time[2] <= 59;
      },
      validateDateArray = function (arr) {
        return arr[0] >= 1 && arr[0] <= 9999 && arr[1] >= 1 && arr[1] <= 12 && arr[2] >= 1 && arr[2] <= 31;
        // TODO: Month lengths and leap years, etc.
      },
      humanTime = function (time) {
        return pad(time[0]) + ':' + pad(time[1]) + (time[2] === 0 ? '' : ':' + pad(time[2]));
      },
      humanDateArray = function (dateArray) {
        return pad(dateArray[0], 4) + '-' + pad(dateArray[1]) + '-' + pad(dateArray[2]);
      },
      dateToTime = function (date) {
        var jsdate = jsDate(date);
        return [jsdate.getHours(), jsdate.getMinutes(), jsdate.getSeconds()];
      },
      dateToDateArray = function (date) {
        var jsdate = jsDate(date);
        return [jsdate.getFullYear(), jsdate.getMonth()+1, jsdate.getDate()];
      },
      compareTime = function (a, b) {
        return (a[0]-b[0]) * 3600 + (a[1]-b[1]) * 60 + (a[2]-b[2]);
      },
      compareDateArray = function (a, b) {
        return (a[0]-b[0]) * 384 + (a[1]-b[1]) * 32 + (a[2]-b[2]);
      },
      parseTime = function (str) {
        var match = timeRegex.exec(str),
            hours, arr;
        if (!match) {
          return null;
        };
        hours = match[1] * 1;
        if (hours < 12) {
          hours += ((match[5]||'').toLowerCase()[0] === 'p' ? 12 : 0);
        }
        arr = [hours, match[2]*1, (match[4] || 0)*1];
        return validateTime(arr) ? arr : null;
      },
      parseDateArray = function (str) {
        return dateToDateArray(new Date(str));
      };

  return {
    time: {
      toString: humanTime,
      fromString: parseTime,
      compare: compareTime,
      fromDate: dateToTime,
      isValid: validateTime,
    },
    dateArray: {
      toString: humanDateArray,
      fromString: parseDateArray,
      compare: compareDateArray,
      fromDate: dateToDateArray,
      isValid: validateDateArray
    },
  };
}));
