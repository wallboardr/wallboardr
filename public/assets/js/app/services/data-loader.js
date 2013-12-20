define([], function () {
  'use strict';
  var proxyPrefix = '/proxy/',
      getUrl = function (opts) {
        var url = opts.url;
        if (opts.proxy) {
          if (url.substr(0, 7) === 'http://') {
            url = url.substr(7);
          }
          url = proxyPrefix + url;
        }
        return url;
      },
      loaderFactory = function ($http) {
        return function (opts) {
          return $http.get(getUrl(opts)).then(function (data) {
            var payload = data.data;
            if (opts.filter && typeof opts.filter === 'function') {
              payload = opts.filter.call(null, payload);
            }
            return payload;
          });
        };
      };
  loaderFactory.$inject = ['$http'];
  return loaderFactory;
});