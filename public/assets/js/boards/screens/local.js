define(['screen/parsers'], function (parsers) {
  'use strict';

  var setTextSize = function ($elem, $container) {
        var maxWidth = $container.width(),
            maxHeight = $container.height(),
            isTooBig = function ($el) {
              return $el.width() > maxWidth || $el.height() > maxHeight;
            },
            currentSize = 50,
            delta = 10,
            rollback = true;

        $elem.css({'font-size': currentSize + 'px'});
        if (isTooBig($elem)) {
          delta = -delta;
          rollback = false;
        }

        do {
          currentSize += delta;
          $elem.css({'font-size': currentSize + 'px'});
        } while ((rollback !== isTooBig($elem)) && currentSize > 0 && currentSize < 300);
        if (rollback || currentSize === 0) {
          currentSize -= delta;
          $elem.css({'font-size': currentSize + 'px'});
        }
      },
      localScreen = function () {
        var self = this,
            viewData;
        return {
          getViewData: function () {
            var lines = parsers.parse(self.data.message);
            viewData = {lines: lines, title: lines.title ? self.data.name : ''};
            return viewData;
          },
          preShow: function () {
            if (viewData.lines.bigtext) {
              self.$screen.bigtext();
            } else {
              setTextSize(self.$screen, self.$container);
            }
          }
        };
      };

  localScreen.config = {
    typeName: 'local',
    humanName: 'Local',
    templateName: 'localMessage',
    centered: true
  };
  return localScreen;
});