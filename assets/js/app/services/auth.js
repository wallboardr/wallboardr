define(['angular'], function (angular) {
  'use strict';
  var authFactory = function ($rootScope, $cookies) {
    var emptyUser = { name: '', role: null };
    var transformUser = function (basic) {
      var enhanced = {
            name: basic.name,
            email: basic.email,
            loggedIn: !!basic.role,
            isAdmin: basic.role === 'admin',
            isEditor: basic.role === 'editor',
          };
      return enhanced;
    };

    return {
      setCookieUser: function () {
        var user = angular.copy(emptyUser),
            vals;
        if (!$rootScope.user) {
          if ($cookies.wbuser) {
            vals = $cookies.wbuser.split('||');
            user.name = vals.shift();
            user.role = vals.shift();
            $cookies.wbuser = null;
          }
          $rootScope.user = transformUser(user);
        }
      },
      setUser: function (user) {
        $rootScope.user = transformUser(user);
        return $rootScope.user;
      },
      user: function () {
        this.setCookieUser();
        return $rootScope.user;
      },
      resetUser: function () {
        angular.copy(transformUser(emptyUser), $rootScope.user);
        $rootScope.$broadcast('user:logout');
      }
    };
  };
  authFactory.$inject = ['$rootScope', '$cookies'];

  return authFactory;
});