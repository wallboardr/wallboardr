define(['jquery', 'screen/common', 'screen/parsers'], function ($, common, parsers) {
  'use strict';

  var initText = function (text, $board) {
        var lines = parsers.parse(text),
            $scr = common.templates.localMessage({lines: lines});

        $board.animate({opacity: 0}, function () {
          $board.html($scr);
          $scr.bigtext();
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
    return common.delay(this.duration);
  };

  return function (data, boardProps) {
    return new LocalScreen(data, boardProps);
  };
});