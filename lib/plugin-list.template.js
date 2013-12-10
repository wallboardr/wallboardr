define([
  {{#plugins}}
  'plugin/{{name}}/{{type}}',
  {{/plugins}}
], function () {
  'use strict';
  return Array.prototype.slice.call(arguments);
});