define(['screen/local'], function (local) {
  'use strict';
  var screenTypes = { local: local },
      factory = function (boardProps) {
        return function (screen) {
          return screenTypes[screen.type] ? screenTypes[screen.type](screen, boardProps) : undefined;
        };
      };
  return factory;
});