define([], function () {
  'use strict';
  var authFactory = function ($rootScope, $cookies) {
    return {
      user: function () {
        var user = { name: '', role: null },
            vals;

        if (!$rootScope.user) {
          if ($cookies.wbuser) {
            vals = $cookies.wbuser.split('||');
            user.name = vals.shift();
            user.role = vals.shift();
            $cookies.wbuser = null;
          }
          $rootScope.user = user;
        }
        return $rootScope.user;
      },
      isAdmin: function () {
        return this.user().role === 'admin';
      },
      isEditor: function () {
        return this.user().role === 'editor';
      }
    };
  };
  authFactory.$inject = ['$rootScope', '$cookies'];

  return authFactory;
});