define([
    'jquery',
    'screen/common',
    'boards/data-loader',
    'teamcity-api'
  ], function ($, common, loader, tc) {
  'use strict';

  var proxyPrefix = '/proxy/',
      initScreen = function (data, $board) {
          var $scr = common.templates.html1up();
          $scr.find('.target').load(proxyPrefix + 'nothing', function () {
            $board.animate({opacity: 0}, function () {
              $board.html($scr);
              common.center($board, $scr);
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
          scr.$screen = initScreen(scr.data, $board);
        }
      };

  var TeamcityScreen = function (data, boardProps) {
    this.data = data;
    this.duration = data.duration || boardProps.duration;
    this.$screen = null;
  };

  TeamcityScreen.prototype.play = function ($board) {
    transition(this, $board);
    return common.delay(this.duration);
  };

  return function (data, boardProps) {
    return new TeamcityScreen(data, boardProps);
  };
});