define([
    'directives/checkbox-directive'
  ],
  function () {
  'use strict';

  var directives = Array.prototype.slice.call(arguments);

  var directiveLoader = function (app) {
    var dIndex = 0;
    if (!app.directive || typeof app.directive !== 'function') {
      throw new Error('app needs to have a function called controller');
    }
    for (; dIndex < directives.length; dIndex += 1) {
      if (directives[dIndex]) {
        app.directive(directives[dIndex].dirName, directives[dIndex]);
      }
    }
  };

  return directiveLoader;
});