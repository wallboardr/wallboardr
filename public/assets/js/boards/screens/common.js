define(['lib/icanhaz', 'boards/delay', 'jquery'], function (ich, delay, $) {
  'use strict';
  var centerMessage = function ($outer, $inner) {
        var outerHeight = $outer.height(),
            innerHeight = $inner.height(),
            marginTop = (outerHeight - innerHeight) / 2;
        $inner.css({'margin-top': marginTop + 'px'});
      },
      fetchTemplate = function (plugin, name) {
        var url = '/assets/plugins/' + plugin + '/' + (name || 'screen') + '.mustache';
        return $.ajax({
          url: url,
          dataType: 'html'
        });
      };
  return {
    templates: ich,
    delay: delay,
    center: centerMessage,
    fetchTemplate: fetchTemplate
  };
});
