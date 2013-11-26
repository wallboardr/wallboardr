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
              url = '/data/boards/slug/' + hash + '?single=true';
          $.ajaxSetup({ dataType: 'json' });
          $.ajax(url).done(function (data) {
            if (data) {
              dataUrl = '/data/screens/board/' + data._id + '?sort=sortkey.' + data._id;
              defaultDuration = data.duration || 30;
              notifyUrl = '/?board=' + data._id;
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