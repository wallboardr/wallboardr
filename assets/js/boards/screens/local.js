define(['jquery', 'lib/icanhaz', 'boards/delay'], function ($, ich, delay) {
  'use strict';

  var centerMessage = function ($outer, $inner) {
          var outerHeight = $outer.height(),
              innerHeight = $inner.height(),
              marginTop = (outerHeight - innerHeight) / 2;
          $inner.css({'margin-top': marginTop + 'px'});
      },
      initText = function (text, $board) {
          var lines = text.replace(/\n/g, '<br>').split('%'),
              $scr = ich.localMessage({lines: lines});

          $board.animate({opacity: 0}, function () {
              $board.html($scr);
              $scr.bigtext();
              centerMessage($board, $scr);
              $board.animate({opacity: 1});
          });

          return $scr;
      },
      transition = function (scr, $board) {
        if (scr.$screen) {
          $board.animate({opacity: 0}, function () {
            $board.html(scr.$screen);
            $board.animate({opacity: 1});
          });
        } else {
          scr.$screen = initText(scr.data.message, $board);
        }
      };

  var LocalScreen = function (data, boardProps) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
    this.$screen = null;
  };

  LocalScreen.prototype.play = function ($board) {
    transition(this, $board);
    return delay(this.duration);
  };
  
  return function (data, boardProps) {
    return new LocalScreen(data, boardProps);
  };
});