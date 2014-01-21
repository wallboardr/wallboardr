define(['jquery',
        'lib/icanhaz',
        'screen/player',
        'primus',
        'boards/delay',
        'lib/bigtext'
        ],
function ($, ich, player, Primus, delay) {
    'use strict';

    var $screen = $('.screen'),
        $notification = $('.notification'),
        dataUrl,
        notifyUrl,
        defaultDuration = 30,
        screenPlayer,
        primus,
        hideNotification = function () {
          $notification.fadeOut(400);
        },
        showNotification = function () {
          $notification.fadeIn(400);
          delay(1.5).then(hideNotification);
        },
        refreshPage = function () {
          window.location.reload(true);
        },
        updateData = function () {
          $.ajax(dataUrl).done(function (data) {
              if (data.length) {
                  screenPlayer.update(data);
              }
          });
        },
        getBoardData = function () {
          var hash = window.location.href.substr(window.location.href.indexOf('#')+1),
              prefix = hash.substr(0, 4),
              url;
          $.ajaxSetup({ dataType: 'json' });
          $screen.spin('board');
          if (prefix === 'SCR-') {
            dataUrl = '/screens/' + hash.substr(4);
            notifyUrl = null;
            initData();
            return;
          }
          if (prefix === 'PRE-') {
            url = hash.substr(4);
            handleScreens([$.parseJSON(url)]);
            return;
          }
          url = '/boards?slug=' + hash;
          $.ajax(url).done(function (data) {
            if (data && data.length) {
              dataUrl = '/screens?{"board":"' + data[0].id + '","disabled":false,"$sort":{"sortkey.' + data[0].id + '":1}}';
              defaultDuration = data[0].duration || defaultDuration;
              notifyUrl = '/?board=' + data[0].id;
              initData();
            }
          });
        },
        handleScreens = function (data) {
          // If result is a single screen, wrap in array.
          if (data._created) {
            data = [data];
          }
          if (data.length) {
            screenPlayer = player(data, defaultDuration, $screen);
            screenPlayer.start();
          }
        },
        initData = function () {
            ich.grabTemplates();
            $.ajax(dataUrl).done(handleScreens).fail(function () {
              $screen.spin(false);
              $('.welcome').html(function (i, old) {
                return old + '<br><br>No screens to show...';
              });
            });
            if (!notifyUrl) {
              return;
            }
            primus = new Primus(notifyUrl);
            primus.on('data', function (data) {
              if (data && data.type) {
                switch (data.type) {
                  case 'HUP':
                    updateData();
                    showNotification();
                    break;
                  case 'UPGRADE':
                    refreshPage();
                    break;
                  default:
                    if (window.console) {
                      window.console.log('Unknown signal: ' + data.type);
                    }
                }
              }
            });
        };

    return {
        bootstrap: getBoardData
    };
});