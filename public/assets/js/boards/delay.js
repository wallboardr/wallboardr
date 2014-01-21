define(['jquery'], function ($) {
  'use strict';

  var delay = function (time, arg, ff) {
    var defer = $.Deferred(),
        timer,
        logger = function (ev) {
          if (ff.call(this, ev)) {
            clearTimeout(timer);
            $(document).off('keydown.delay');
            defer.resolve(arg);
          }
        };
    timer = setTimeout(function () {
      $(document).off('keydown.delay');
      defer.resolve(arg);
    }, time);
    if (ff) {
      $(document).on('keydown.delay', logger);
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
  };
  return {
    inSeconds: delaySeconds,
    shortCircuit: delayWithFastforward
  };
});