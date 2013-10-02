define(['jquery', 'screen/common', 'screen/parsers'], function ($, common, parsers) {
  'use strict';

  var setTextSize = function ($elem, $container) {
        var maxWidth = $container.width(),
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
      },
      initText = function (data, $board) {
        var lines = parsers.parse(data.message),
            $scr = common.templates.localMessage({lines: lines, title: lines.title ? data.name : ''});

        $board.animate({opacity: 0}, function () {
          $board.html($scr);
          if (lines.bigtext) {
            $scr.bigtext();
          } else {
            setTextSize($scr, $board);
          }
          common.center($board, $scr);
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
          scr.$screen = initText(scr.data, $board);
        }
      };

  var LocalScreen = function (data, boardProps) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
    this.$screen = null;
  };

  LocalScreen.prototype.play = function ($board) {
    transition(this, $board);
    return common.delay(this.duration);
  };

  return function (data, boardProps) {
    return new LocalScreen(data, boardProps);
  };
});