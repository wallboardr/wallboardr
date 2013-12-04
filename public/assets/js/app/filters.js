define([], function () {
  'use strict';
  var nl2br = function () {
    return function (input) {
      return input && input.replace(/\n/g, '<br>');
    };
  };
  var humanType = function () {
    var map = {
        'message': 'Message',
        'html': 'Fetch HTML',
        'teamcity': 'TeamCity'
    };
    return function (input) {
        return map[input] || 'Unknown';
    };
  };
  return {
    nl2br: nl2br,
    humanType: humanType
  };
});