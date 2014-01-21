define([
  'plugin/plugin-list-screen',
  'screen/screen'
], function (screenPlugins, createScreen) {
  'use strict';
  var screenTypes = (function () {
        var plg = 0, types = {};
        for (; plg < screenPlugins.length; plg += 1) {
          if (screenPlugins[plg] && screenPlugins[plg].config.name) {
            types[screenPlugins[plg].config.name] = screenPlugins[plg];
          }
        }
        return types;
      }()),
      factory = function (boardProps, $container) {
        return function (screen) {
          return screenTypes[screen.type] ?
                    createScreen(screen, boardProps, $container, screenTypes[screen.type])
                    : undefined;
        };
      };
  return factory;
});