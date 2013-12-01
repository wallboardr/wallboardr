define(['jquery', 'screen/common'], function ($, common) {
  'use strict';

  var initialize = function (scr) {
        var viewData = scr.plugin('getViewData'),
            templateName = scr.plugin.config.templateName || scr.plugin.config.typeName,
            $scr = common.templates[templateName](viewData);

        return $scr;
      },
      transition = function (scr) {
        scr.$screen = scr.$screen || initialize(scr);

        scr.$container.animate({opacity: 0}, function () {
          scr.$container.html(scr.$screen);
          scr.plugin('preShow');
          if (scr.plugin.config.centered && scr.firstRender) {
            common.center(scr.$container, scr.$screen);
          }
          scr.$container.animate({opacity: 1});
          scr.plugin('postShow');
          scr.firstRender = false;
        });
      },
      plugify = function (fn, context) {
        var plugin = $.proxy(fn, context)($),
            safeInvoke = function (fnName) {
              if (typeof plugin[fnName] === 'function') {
                return plugin[fnName]();
              }
              return undefined;
            };
        safeInvoke.config = fn.config;
        return safeInvoke;
      };

  var Screen = function (data, boardProps, $container, plugin) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
    this.$container = $container;
    this.plugin = plugify(plugin, this);
    this.firstRender = true;
    this.$screen = null;
  };

  Screen.prototype.play = function () {
    transition(this);
    return common.delay(this.duration);
  };

  return function (data, boardProps, $container, plugin) {
    return new Screen(data, boardProps, $container, plugin);
  };
});