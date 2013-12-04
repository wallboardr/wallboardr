define([
  'screen/screen',
  'plugin/message/screen'
], function () {
  'use strict';
  var screenPlugins = Array.prototype.slice.call(arguments),
      createScreen = screenPlugins.shift(),
      screenTypes = (function () {
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
          return !screen.disabled && screenTypes[screen.type] ?
                    createScreen(screen, boardProps, $container, screenTypes[screen.type])
                    : undefined;
        };
      };
  return factory;
});