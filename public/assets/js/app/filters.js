define([], function () {
  'use strict';
  var nl2br = function () {
    return function (input) {
      return input && input.replace(/\n/g, '<br>');
    };
  };
  var humanType = function ($rootScope) {
    return function (input) {
        var plugin = $rootScope.plugins.map[input];
        return plugin ? (plugin.humanName || plugin.name) : (input || 'Unknown');
    };
  };
  humanType.$inject = ['$rootScope'];
  return {
    nl2br: nl2br,
    humanType: humanType
  };
});