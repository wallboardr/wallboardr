define(['screen/local', 'screen/html', 'screen/teamcity'], function (local, html, teamcity) {
  'use strict';
  var screenTypes = { local: local, html: html, teamcity: teamcity },
      factory = function (boardProps) {
        return function (screen) {
          return screenTypes[screen.type] ? screenTypes[screen.type](screen, boardProps) : undefined;
        };
      };
  return factory;
});