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
      },
      inArray = function (arr, search) {
        if (arr === undefined || arr === null) {
          throw new TypeError('"arr" has nop value');
        }
        var length = arr.length, index;
        for (index = 0; index < length; index += 1) {
          if (arr[index] === search) {
            return true;
          }
        }
        return false;
      };

  return {
    cleanForm:   cleanForm,
    sanitize:    sanitize,
    multiLinked: multiLinked,
    inArray:     inArray
  };
});