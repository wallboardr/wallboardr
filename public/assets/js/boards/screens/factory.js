define([
  'plugin/plugin-list-screen',
  'screen/screen'
], function (screenPlugins, createScreen) {
  'use strict';
  var screenTypes = (function () {
        var plg = 0, types = {};
        for (; plg < screenPlugins.list.length; plg += 1) {
          if (screenPlugins.list[plg] && screenPlugins.list[plg].config.name) {
            types[screenPlugins.list[plg].config.name] = screenPlugins.list[plg];
          }
        }
        return types;
      }()),
      factory = function (boardProps, $container) {
        return function (screen) {
          return screenTypes[screen.type] ?
                    createScreen(screen, boardProps, $container, screenTypes[screen.type], screenPlugins.config)
                    : undefined;
        };
      };
  return factory;
});