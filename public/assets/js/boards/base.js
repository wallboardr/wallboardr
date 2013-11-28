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
        getBoardData = function () {
          var hash = window.location.href.substr(window.location.href.indexOf('#')+1),
              url = '/boards?slug=' + hash;
          $.ajaxSetup({ dataType: 'json' });
          $.ajax(url).done(function (data) {
            if (data && data.length) {
              dataUrl = '/screens?{"board":"' + data[0].id + '","$sort:{"sortkey.' + data[0].id + '":1}}';
              defaultDuration = data[0].duration || 30;
              notifyUrl = '/?board=' + data[0].id;
              initData();
            }
          });
        },
        initData = function () {
            ich.grabTemplates();
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
        bootstrap: getBoardData
    };
});