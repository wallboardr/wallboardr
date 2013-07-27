define(['jquery'], function ($) {
  'use strict';

  return function (url) {
    return $.ajax(url, {
      dataType: 'json'
    });
  };
});