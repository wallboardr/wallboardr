define(['jquery', 'screen/common', 'lib/jquery.spin'], function ($, common) {
  'use strict';

  var clearMe = function (scr) {
        scr.$screen = null;
        if (scr.solo) {
          initialize(scr).then(transition);
        }
      },
      backOff = function (scr) {
        scr.vderror = true;
        scr.vdwait += 1;
        if (window.console) {
          window.console.log('Waiting for ' + scr.vdwait + ' minutes to try again');
        }
        common.delay(scr.vdwait * 60, scr).then(function (s) {
          s.vderror = false;
        });
      },
      initialize = function (scr) {
        var templateName = scr.plugin.config.templateName || scr.plugin.config.name,
            pollInterval = scr.plugin.config.pollInterval || 0,
            viewPromise;

        if (scr.vderror) {
          return $.when(scr);
        }
        viewPromise = scr.plugin('getViewData');

        scr.firstRender = true;
        if (pollInterval > 0) {
          common.delayWith(pollInterval, scr, 80).then(clearMe);
        }

        return viewPromise.then(function (viewData) {
          scr.$screen = common.templates[templateName](viewData || {});
          scr.vderror = false;
          scr.vdwait = 0;
          return scr;
        }, function (err) {
          if (window.console) {
            window.console.warn('Error fetching view data', err);
          }
          backOff(scr);
          return $.when(scr);
        });
      },
      transition = function (scr) {
        if (scr.vderror) {
          return 0;
        }
        scr.$container.animate({opacity: 0}, function () {
          scr.$container.spin(false);
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
          if (scr.solo && !scr.firstRender) {
            return scr.duration;
          }
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
              return $.when(null);
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
      setTextSize = function (startSize, increment) {
        var $elem = this.$screen,
            $container = this.$container,
            maxWidth = $container.width(),
            maxHeight = $container.height(),
            isTooBig = function ($el) {
              return $el.width() > maxWidth || $el.height() > maxHeight;
            },
            currentSize = startSize || 50,
            delta = increment || 10,
            rollback = true;

        if (!$elem) {
          return null;
        }

        $elem.css({'font-size': currentSize + 'px', 'float': 'left'});
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
        $elem.css({'float': 'none'});
        return currentSize;
      };

  var Screen = function (data, boardProps, $container, plugin, globalConfig) {
    this.props = data;
    this.duration = data.duration || boardProps.duration;
    this.$container = $container;
    this.plugin = plugify(plugin, this);
    this.firstRender = true;
    this.$screen = null;
    this.solo = false;
    this.vdwait = 0;
    this.globalConfig = globalConfig;
  };

  Screen.prototype.play = function () {
    var self = this;
    return this.plugin('shouldBeShown').then(function (sbs) {
      if (sbs !== false) {
        return loadTemplate.call(self).then(loadScreen).then(common.delay);
      }
      return false;
    });
  };

  Screen.prototype.youAreOnYourOwn = function (neg) {
    this.solo = (neg !== false);
  };

  Screen.prototype.maximizeTextSize = setTextSize;

  return function (data, boardProps, $container, plugin, globalConfig) {
    return new Screen(data, boardProps, $container, plugin, globalConfig);
  };
});