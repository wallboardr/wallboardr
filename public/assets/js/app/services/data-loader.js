define([], function () {
  'use strict';
  var proxyPrefix = '/json/',
      getUrl = function (opts) {
        var url = opts.url;
        if (opts.proxy) {
          url = proxyPrefix + encodeURIComponent(url);
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