define(['angular'], function (angular) {
  'use strict';
  var authFactory = function ($rootScope, $cookies, $http) {
    var transformUser = function (basic) {
      var enhanced = {
            name: basic.username,
            email: basic.email,
            loggedIn: !!basic.role,
            isAdmin: basic.role === 'admin',
            isEditor: basic.role === 'editor',
          };
      return enhanced;
    };

    return {
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
        return $http.post('/users/login', username).then(function (res) {
          if (res && res.data) {
            self.whoAmI();
            return true;
          }
          return false;
        });
      },
      logout: function () {
        var self = this;
        return $http.get('/users/logout').then(function () {
          self.resetUser();
        });
      },
      registerAdmin: function (fields) {
        fields.role = 'admin';
        return $http.post('/users', fields);
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
        angular.copy(transformUser({}), $rootScope.user);
        $rootScope.$broadcast('user:logout');
      }
    };
  };
  authFactory.$inject = ['$rootScope', '$cookies', '$http'];

  return authFactory;
});