define(['jquery', 'screen/common'], function ($, common) {
  'use strict';

  var clearMe = function (scr) {
        scr.$screen = null;
      },
      initialize = function (scr) {
        var templateName = scr.plugin.config.templateName || scr.plugin.config.name,
            pollInterval = scr.plugin.config.pollInterval || 0,
            viewPromise = scr.plugin('getViewData');

        if (pollInterval > 0) {
          common.delay(pollInterval, scr).then(clearMe);
        }

        if (viewPromise !== undefined) {
          return viewPromise.then(function (viewData) {
            scr.$screen = common.templates[templateName](viewData);
            return scr;
          });
        }

        scr.$screen = common.templates[templateName]({});
        return $.when(scr);
      },
      transition = function (scr) {
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
        return scr.duration;
      },
      loadScreen = function (scr) {
        if (scr.$screen) {
          return transition(scr);
        }
        return initialize(scr).then(transition);
      },
      plugify = function (fn, context) {
        var plugin = $.proxy(fn, context)($),
            safeInvoke = function (fnName) {
              if (typeof plugin[fnName] === 'function') {
                return $.when(plugin[fnName]());
              }
              return undefined;
            };
        safeInvoke.config = fn.config;
        return safeInvoke;
      },
      loadTemplate = function () {
        var self = this,
            templateName = this.plugin.config.templateName || this.plugin.config.name;
        if (!common.templates[templateName]) {
          return common.fetchTemplate(this.plugin.config.name).then(function (data) {
            if (data) {
              common.templates.addTemplate(templateName, data);
            } else {
              common.templates.addTemplate(templateName, '<div class="no-template">No template available for this screen plugin: ' + templateName + '</div>');
            }
            return self;
          });
        }
        return $.when(self);
      },
      setTextSize = function () {
        var $elem = this.$screen,
            $container = this.$container,
            maxWidth = $container.width(),
            maxHeight = $container.height(),
            isTooBig = function ($el) {
              return $el.width() > maxWidth || $el.height() > maxHeight;
            },
            currentSize = 50,
            delta = 10,
            rollback = true;

        $elem.css({'font-size': currentSize + 'px'});
        if (isTooBig($elem)) {
          delta = -delta;
          rollback = false;
        }

        do {
          currentSize += delta;
          $elem.css({'font-size': currentSize + 'px'});
        } while ((rollback !== isTooBig($elem)) && currentSize > 0 && currentSize < 300);
        if (rollback || currentSize === 0) {
          currentSize -= delta;
          $elem.css({'font-size': currentSize + 'px'});
        }
      };

  var Screen = function (data, boardProps, $container, plugin) {
    this.props = data;
    this.duration = data.duration || boardProps.duration;
    this.$container = $container;
    this.plugin = plugify(plugin, this);
    this.firstRender = true;
    this.$screen = null;
  };

  Screen.prototype.play = function () {
    return loadTemplate.call(this).then(loadScreen).then(common.delay);
  };

  Screen.prototype.maximizeTextSize = setTextSize;

  return function (data, boardProps, $container, plugin) {
    return new Screen(data, boardProps, $container, plugin);
  };
});