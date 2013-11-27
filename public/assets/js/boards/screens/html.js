define(['jquery', 'lib/icanhaz', 'boards/delay'], function ($, ich, delay) {
  'use strict';

  var proxyPrefix = '/proxy/',
      centerMessage = function ($outer, $inner) {
          var outerHeight = $outer.height(),
              innerHeight = $inner.height(),
              marginTop = (outerHeight - innerHeight) / 2;
          $inner.css({'margin-top': marginTop + 'px'});
      },
      initScreen = function (url, sel, $board) {
          var $scr = ich.html1up();
          $scr.find('.target').load(proxyPrefix + encodeURIComponent(url) + ' ' + sel, function () {
            $board.animate({opacity: 0}, function () {
              $board.html($scr);
              centerMessage($board, $scr);
              $board.animate({opacity: 1});
            });
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
          scr.$screen = initScreen(scr.data.url, scr.data.selector, $board);
        }
      };

  var HtmlScreen = function (data, boardProps) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
    this.$screen = null;
  };

  HtmlScreen.prototype.play = function ($board) {
    transition(this, $board);
    return delay(this.duration);
  };
  
  return function (data, boardProps) {
    return new HtmlScreen(data, boardProps);
  };
});