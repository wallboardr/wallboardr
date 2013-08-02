define(['jquery',
        'lib/icanhaz',
        'screen/player',
        'primus',
        'lib/bigtext'
        ],
function ($, ich, player, Primus) {
    'use strict';

    var $screen = $('.screen'),
        dataUrl,
        notifyUrl,
        defaultDuration,
        screenPlayer,
        primus,
        updateData = function () {
          $.ajax(dataUrl).done(function (data) {
              if (data.length) {
                  screenPlayer.update(data);
              }
          });
        },
        initData = function () {
            $.ajaxSetup({ dataType: 'json' });
            ich.grabTemplates();
            dataUrl = $('body').data('url');
            notifyUrl = $('body').data('notify');
            defaultDuration = $('body').data('duration') || 30;
            $.ajax(dataUrl).done(function (data) {
                if (data.length) {
                    screenPlayer = player(data, defaultDuration);
                    screenPlayer.start($screen);
                }
            });
            primus = new Primus(notifyUrl);
            primus.on('data', function (data) {
              if (data && data.type && data.type === 'HUP') {
                updateData();
              }
            });
        };

    return {
        bootstrap: initData
    };
});