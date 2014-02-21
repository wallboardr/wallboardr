define([], function () {
  'use strict';
  var notifierFactory = function ($http) {
        return {
          refreshBoard: function (boardId) {
            $http.post('/notify/' + boardId);
          },
          refreshAll: function () {
            $http.post('/notify/HUP');
          },
          upgradeAll: function () {
            $http.post('/notify/UPGRADE');
          }
        };
      };
  notifierFactory.$inject = ['$http'];
  return notifierFactory;
});