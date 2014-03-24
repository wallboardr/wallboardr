define(['require', './schedule'], function (require) {
  'use strict';
  var plugin = {},
      scheduler = require('./schedule');
  plugin.config = {
    name: 'message',
    humanName: 'Text message',
    templateName: 'localMessage',
    centered: true,
    scheduler: scheduler
  };

  return plugin;
});