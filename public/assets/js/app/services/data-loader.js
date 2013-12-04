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
            if (opts.filter && typeof opts.filter === 'function') {
              data = opts.filter.call(null, data);
            }
            return data;
          });
        };
      };
  loaderFactory.$inject = ['$http'];
  return loaderFactory;
});