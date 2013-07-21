define([], function () {
  'use strict';
  var nl2br = function () {
    return function (input) {
      return input && input.replace('\n', '<br>');
    };
  };

  return {
    nl2br: nl2br
  };
});