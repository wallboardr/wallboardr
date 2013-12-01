define(['jquery', 'boards/delay', 'screen/factory'], function ($, delay, factory) {
  'use strict';

    var Player = function (screens, defaultDuration, $screen) {
          var boardProps = { duration : defaultDuration };
          this.screenFactory = factory(boardProps, $screen);
          this.screens = $.map(screens, this.screenFactory);
          this.currentIndex = 0;
        },
        initialize = function (screens, defaultDuration, $screen) {
          return new Player(screens, defaultDuration, $screen);
        },
        incrementScreen = function () {
          var self = this;
          if (self.screens === 1) {

          }
          self.currentIndex += 1;
          if (self.screens.length <= self.currentIndex) {
            self.currentIndex = 0;
          }
        },
        playScreen = function () {
          var self = this,
              current = self.screens[self.currentIndex],
              increment = $.proxy(incrementScreen, self);

          current.play().then(increment).then(function () {
            if (self.screens.length > 1) {
              playScreen.apply(self);
            }
          });
        };

    Player.prototype.start = function () {
      var self = this;
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

  return initialize;
});