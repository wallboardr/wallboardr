define([
    'jquery',
    'screen/common',
    'boards/data-loader',
    'teamcity-api'
  ], function ($, common, loader, tc) {
  'use strict';

  var proxyPrefix = '/proxy/',
      initScreen = function (data, $board) {
        var mydata = {
          projectId: 'PP',
          projectTitle: 'Public Pages',
          status: 'failure',
          configs: [
            {status: 'success', id: '123'},
            {status: 'success', id: '124'},
            {status: 'success', id: '125'},
            {status: 'success', id: '126'},
            {status: 'failure', id: '127'},
          ]
        };
        var $scr = common.templates.teamcityPipeline(mydata);
        //$scr.find('.target').load(proxyPrefix + 'nothing', function () {
          $board.animate({opacity: 0}, function () {
            $board.html($scr);
            common.center($board, $scr);
            $board.animate({opacity: 1});
          });
        //});

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