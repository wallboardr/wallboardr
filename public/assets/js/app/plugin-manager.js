define([
  'plugin/message/admin',
  'plugin/teamcity/admin'
], function () {
  'use strict';

  var plugins = Array.prototype.slice.call(arguments);
  var pluginlist = [];
  pluginlist.map = {};

  var pluginManager = function (app) {
    var pIndex = 0;
    if (!app.controller || typeof app.controller !== 'function') {
      throw new Error('app needs to have a function called controller');
    }
    for (; pIndex < plugins.length; pIndex += 1) {
      if (plugins[pIndex].config && plugins[pIndex].config.name) {
        if (plugins[pIndex].config.controller) {
          app.controller(plugins[pIndex].config.controller, plugins[pIndex]);
        }
        pluginlist.push(plugins[pIndex].config);
        pluginlist.map[plugins[pIndex].config.name] = plugins[pIndex].config;
      }
    }
  };

  pluginManager.service = function ($rootScope) {
    return {
      register: function () {
        $rootScope.plugins = pluginlist;
      }
    };
  };
  pluginManager.service.$inject = ['$rootScope'];

  return pluginManager;
});