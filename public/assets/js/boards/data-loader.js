define(['jquery'], function ($) {
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
      };

  return function (opts) {
    return $.ajax(getUrl(opts), {
      dataType: 'json',
      headers: {
        'Accept': 'application/json'
      }
    }).then(function (data) {
      if (opts.filter && typeof opts.filter === 'function') {
        data = opts.filter.call(null, data);
      }
      return data;
    });
  };
});