define([], function () {
  'use strict';
  var notifierFactory = function ($http, primus) {
        return {
          refreshBoard: function (boardId) {
            primus.write({updated: boardId});
          },
          refreshAll: function () {
            $http.post('/notify/HUP');
          },
          upgradeAll: function () {
            $http.post('/notify/UPGRADE');
          }
        };
      };
  notifierFactory.$inject = ['$http', 'primus'];
  return notifierFactory;
});