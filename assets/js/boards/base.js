define(['jquery', 'lib/icanhaz', 'lib/bigtext'], function ($, ich) {
    'use strict';
    
    var $screen = $('.screen'),
        dataUrl,
        defaultDuration,
        screens,
        currentScreen = 0,
        centerMessage = function ($outer, $inner) {
            var outerHeight = $outer.height(),
                innerHeight = $inner.height(),
                marginTop = (outerHeight - innerHeight) / 2;
            $inner.css({'margin-top': marginTop + 'px'});
        },
        initText = function (text) {
            var lines = text.split('\n'),
                $scr = ich.localMessage({lines: lines});

            $screen.animate({opacity: 0}, function () {
                $screen.html($scr);
                $scr.bigtext();
                centerMessage($screen, $scr);
                $screen.animate({opacity: 1});
            });
        },
        playScreen = function () {
            var duration = screens[currentScreen].duration || defaultDuration;
            initText(screens[currentScreen].message);
            if (screens.length === 1) {
                return;
            }
            currentScreen += 1;
            if (screens.length <= currentScreen) {
                currentScreen = 0;
            }
            setTimeout(playScreen, duration * 1000);
        },
        initData = function () {
            $.ajaxSetup({ dataType: 'json' });
            ich.grabTemplates();
            dataUrl = $('body').data('url');
            defaultDuration = $('body').data('duration') || 30;
            $.ajax(dataUrl).done(function (data) {
                screens = data;
                if (screens.length) {
                    playScreen();
                }
            });
        };

    return {
        bootstrap: initData
    };
});