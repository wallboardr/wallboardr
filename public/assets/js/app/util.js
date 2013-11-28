define(['angular'], function (angular) {
  'use strict';

  var hop = Object.prototype.hasOwnProperty,
      cleanForm = function (form) {
        var key;
        for (key in form) {
          if (hop.call(form, key) && key[0] !== '$') {
            form[key] = '';
          }
        }
      },
      sanitize = function (data) {
        var key, toRemove = [];
        for (key in data) {
          if (hop.call(data, key) && key[0] === '_') {
            toRemove.push(key);
          }
        }
        for (key = 0; key < toRemove.length; key += 1) {
          delete data[toRemove[key]];
        }
      },
      multiLinked = function (scr) {
        return (angular.isArray(scr.board) && scr.board.length > 1);
      };

  return {
    cleanForm:   cleanForm,
    sanitize:    sanitize,
    multiLinked: multiLinked
  };
});