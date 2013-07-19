define(['jquery', 'lib/icanhaz', 'screen/player', 'lib/bigtext'], function ($, ich, player) {
    'use strict';
    
    var $screen = $('.screen'),
        dataUrl,
        defaultDuration,
        screenPlayer,
        initData = function () {
            $.ajaxSetup({ dataType: 'json' });
            ich.grabTemplates();
            dataUrl = $('body').data('url');
            defaultDuration = $('body').data('duration') || 30;
            $.ajax(dataUrl).done(function (data) {
                if (data.length) {
                    screenPlayer = player(data, defaultDuration);
                    screenPlayer.start($screen);
                }
            });
        };

    return {
        bootstrap: initData
    };
});