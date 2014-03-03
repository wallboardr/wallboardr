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
    var headers = {
      'Accept': opts.accept || 'application/json'
    };
    if (opts.serverProxy) {
      headers['X-Proxy-Server'] = opts.serverProxy;
    }
    return $.ajax(getUrl(opts), {
      dataType: opts.dataType || 'json',
      headers: headers
    }).then(function (data) {
      if (opts.filter && typeof opts.filter === 'function') {
        data = opts.filter.call(null, data);
      }
      return data;
    });
  };
});