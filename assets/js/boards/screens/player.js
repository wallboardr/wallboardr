define(['jquery', 'boards/delay', 'screen/factory'], function ($, delay, factory) {
  'use strict';

    var Player = function (screens, defaultDuration) {
          this.boardProps = { duration : defaultDuration };
          this.screens = $.map(screens, factory(this.boardProps));
          this.currentIndex = 0;
          this.defaultDuration = defaultDuration;
          this.$parent = null;
        },
        initialize = function (screens, defaultDuration) {
          return new Player(screens, defaultDuration);
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
              current = self.screens[self.currentIndex];

          current.play(self.$parent).then(function () {
            incrementScreen.apply(self);
          }).then(function () {
            if (self.screens.length > 1) {
              playScreen.apply(self);
            }
          });
        };

    Player.prototype.start = function ($screen) {
      var self = this;
      self.$parent = $screen;
      if (this.screens.length) {
        playScreen.apply(self);
      }
    };

    Player.prototype.update = function (screens) {
      var self = this,
          prevLength = self.screens.length;
      // TODO: properly update each screen or not.
      self.screens = $.map(screens, factory(self.boardProps));
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