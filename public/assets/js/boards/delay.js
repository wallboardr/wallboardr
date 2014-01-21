define(['jquery'], function ($) {
  'use strict';

  var randomId = function (length, prefix) {
    var buffer = '';
    length = length || 8;
    while (length) {
      buffer += Math.floor(Math.random()*36).toString(36);
      length -= 1;
    }
    return (prefix || '') + buffer;
  },
  delay = function (time, arg, ff) {
    var defer = $.Deferred(),
        timer,
        eventName = 'keydown.delay' + randomId(8),
        logger = function (ev) {
          if (ff.call(this, ev)) {
            clearTimeout(timer);
            $(document).off(eventName);
            defer.resolve(arg);
          }
        };
    timer = setTimeout(function () {
      $(document).off(eventName);
      defer.resolve(arg);
    }, time);
    if (ff) {
      $(document).on(eventName, logger);
    }
    return defer.promise();
  },
  delaySeconds = function (secs, arg) {
    return delay(secs * 1000, arg);
  },
  delayWithFastforward = function (secs, arg) {
    return delay(secs * 1000, arg, function (ev) {
      if (ev.which === 13 || ev.which === 32 || ev.which === 39 || ev.which === 40) {
        return true;
      }
      return false;
    });
  },
  delayWithChar = function (secs, arg, key) {
    return delay(secs * 1000, arg, function (ev) {
      if (ev.which === key) {
        return true;
      }
      return false;
    });
  };
  return {
    inSeconds: delaySeconds,
    shortCircuitForward: delayWithFastforward,
    shortCircuitWith: delayWithChar
  };
});