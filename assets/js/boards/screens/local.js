define(['jquery', 'lib/icanhaz', 'boards/delay'], function ($, ich, delay) {
  'use strict';

  var centerMessage = function ($outer, $inner) {
          var outerHeight = $outer.height(),
              innerHeight = $inner.height(),
              marginTop = (outerHeight - innerHeight) / 2;
          $inner.css({'margin-top': marginTop + 'px'});
      },
      initText = function (text, $screen) {
          var lines = text.split('\n'),
              $scr = ich.localMessage({lines: lines});

          $screen.animate({opacity: 0}, function () {
              $screen.html($scr);
              $scr.bigtext();
              centerMessage($screen, $scr);
              $screen.animate({opacity: 1});
          });
      };

  var LocalScreen = function (data, boardProps) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
  };

  LocalScreen.prototype.play = function ($screen) {
    initText(this.data.message, $screen);
    return delay(this.duration);
  };
  
  return function (data, boardProps) {
    return new LocalScreen(data, boardProps);
  };
});