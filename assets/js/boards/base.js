define(['jquery', 'lib/icanhaz', 'lib/bigtext'], function ($, ich) {
    'use strict';
    
    var $screen = $('.screen'),
        dataUrl,
        screens,
        centerMessage = function ($outer, $inner) {
            var outerHeight = $outer.height(),
                innerHeight = $inner.height(),
                marginTop = (outerHeight - innerHeight) / 2;
            $inner.css({'margin-top': marginTop + 'px'});
        },
        initText = function (text) {
            var lines = text.split('\n'),
                $scr = ich.localMessage({lines: lines});

            $screen.html($scr);
            $scr.bigtext();
            centerMessage($screen, $scr);
        },
        initData = function () {
            $.ajaxSetup({ dataType: 'json' });
            ich.grabTemplates();
            dataUrl = $('body').data('url');
            $.ajax(dataUrl).done(function (data) {
                screens = data;
                if (screens.length) {
                    initText(screens[0].message);
                }
            });
        };

    return {
        bootstrap: initData
    };
});