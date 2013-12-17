define(['jquery', 'boards/delay', 'screen/factory', 'lib/jquery.spin'], function ($, delay, factory) {
  'use strict';

  var Player = function (screens, defaultDuration, $screen) {
        var boardProps = { duration : defaultDuration };
        this.screenFactory = factory(boardProps, $screen);
        this.screens = $.map(screens, this.screenFactory);
        this.$container = $screen;
        this.currentIndex = 0;
      },
      initialize = function (screens, defaultDuration, $screen) {
        return new Player(screens, defaultDuration, $screen);
      },
      incrementScreen = function () {
        var self = this;
        self.currentIndex += 1;
        if (self.screens.length <= self.currentIndex) {
          self.currentIndex = 0;
        }
      },
      playScreen = function () {
        var self = this,
            current = self.screens[self.currentIndex],
            increment = $.proxy(incrementScreen, self);

        if (self.screens.length === 1) {
          current.youAreOnYourOwn();
        }
        current.play().then(increment).then(function () {
          if (self.screens.length > 1) {
            playScreen.apply(self);
          }
        });
      };

  Player.prototype.start = function () {
    var self = this;
    self.$container.spin('board');
    if (this.screens.length) {

      playScreen.apply(self);
    }
  };

  Player.prototype.update = function (screens) {
    var self = this,
        prevLength = self.screens.length;
    // TODO: properly update each screen or not.
    self.screens = $.map(screens, self.screenFactory);
    if (self.currentIndex > self.screens.length - 1) {
      self.currentIndex = self.screens.length - 1;
    }
    if (prevLength === 1 && self.screens.length) {
      self.currentIndex = 0;
      playScreen.apply(self);
    }
  };

  $.fn.spin.presets.board = {
    lines: 9, // The number of lines to draw
    length: 0, // The length of each line
    width: 27, // The line thickness
    radius: 45, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 30, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 0.7, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  return initialize;
});