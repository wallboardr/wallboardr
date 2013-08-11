define(['jquery', 'screen/common', 'screen/parsers'], function ($, common, parsers) {
  'use strict';

  var initText = function (data, $board) {
        var lines = parsers.parse(data.message),
            $scr = common.templates.localMessage({lines: lines, title: lines.title ? data.name : ''});

        $board.animate({opacity: 0}, function () {
          $board.html($scr);
          if (lines.bigtext) {
            $scr.bigtext();
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