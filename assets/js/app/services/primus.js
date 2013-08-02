define(['primus'], function (Primus) {
  'use strict';
  var primusProvider = function () {
    this.url = '';
    this.setUrl = function (url) {
      this.url = url;
    };

    this.$get = function ($window) {
      var self = this,
          primus;
      if (self.url === '') {
        self.url = $window.location.href;
      }
      primus = new Primus(self.url);
      return primus;
    };
    this.$get.$inject = ['$window'];
  };
  return primusProvider;
});