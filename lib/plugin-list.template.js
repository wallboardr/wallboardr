define([
  {{#plugins}}
  'plugin/{{name}}/{{type}}',
  {{/plugins}}
], function () {
  'use strict';
  return {
    config: {
      {{#config}}
      '{{key}}': {{{value}}}
      {{/config}}
    },
    list: Array.prototype.slice.call(arguments)
  };
});