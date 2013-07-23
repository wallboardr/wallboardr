define([], function () {
  'use strict';
  var nl2br = function () {
    return function (input) {
      return input && input.replace(/\n/g, '<br>');
    };
  };

  return {
    nl2br: nl2br
  };
});