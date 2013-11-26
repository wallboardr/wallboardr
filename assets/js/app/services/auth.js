define(['angular'], function (angular) {
  'use strict';
  var authFactory = function ($rootScope, $cookies, $http) {
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
      whoAmI: function () {
        if (!$rootScope.user || !$rootScope.user.name) {
          $http.get('/users/me').then(function (res) {
            $rootScope.user = transformUser(res.data || {});
          });
        }
      },
      login: function (username, password) {
        var self = this;
        if (typeof username === 'string') {
          username = { username: username, password: password };
        }
        return $http.post('/api/login', username).then(function (res) {
          if (res && res.data) {
            return self.setUser(res.data);
          }
          return self.setUser({});
        });
      },
      logout: function () {
        var self = this;
        return $http.get('/api/logout').then(function () {
          self.resetUser();
        });
      },
      registerAdmin: function (fields) {
        fields.role = 'admin';
        return $http.post('/api/register', fields);
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
  authFactory.$inject = ['$rootScope', '$cookies', '$http'];

  return authFactory;
});