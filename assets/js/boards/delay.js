define(['jquery'], function ($) {
  'use strict';

  var delay = function (time, arg) {
    var defer = $.Deferred();
    setTimeout(function () {
      defer.resolve(arg);
    }, time);
    return defer.promise();
  },
  delaySeconds = function (secs, arg) {
    return delay(secs * 1000, arg);
  };
  return delaySeconds;
});