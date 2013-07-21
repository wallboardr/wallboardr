define([], function () {
  'use strict';
  var authFactory = function ($rootScope, $cookies) {
    return {
      setCookieUser: function () {
        var user = { name: '', role: null },
            vals;
        if ($cookies.wbuser) {
          vals = $cookies.wbuser.split('||');
          user.name = vals.shift();
          user.role = vals.shift();
          $cookies.wbuser = null;
        }
        $rootScope.user = user;
      },
      setUser: function (user) {
        $rootScope.user = user;
      },
      user: function () {
        if (!$rootScope.user) {
          this.setCookieUser();
        }
        return $rootScope.user;
      },
      loggedIn: function () {
        return !!this.user().role;
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