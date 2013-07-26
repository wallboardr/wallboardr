define(['lib/icanhaz', 'boards/delay'], function (ich, delay) {
  'use strict';
  var centerMessage = function ($outer, $inner) {
        var outerHeight = $outer.height(),
            innerHeight = $inner.height(),
            marginTop = (outerHeight - innerHeight) / 2;
        $inner.css({'margin-top': marginTop + 'px'});
      };
  return {
    templates: ich,
    delay: delay,
    center: centerMessage
  };
});
