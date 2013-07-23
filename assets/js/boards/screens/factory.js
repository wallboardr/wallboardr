define(['screen/local', 'screen/html'], function (local, html) {
  'use strict';
  var screenTypes = { local: local, html: html },
      factory = function (boardProps) {
        return function (screen) {
          return screenTypes[screen.type] ? screenTypes[screen.type](screen, boardProps) : undefined;
        };
      };
  return factory;
});