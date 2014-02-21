define([], function () {
  'use strict';
  var authFactory = function ($rootScope, $http) {
    var transformUser = function (basic) {
      var enhanced = {
        id: basic.id,
        name: basic.username,
        email: basic.email,
        loggedIn: !!basic.role,
        isAdmin: basic.role === 'admin',
        isEditor: basic.role === 'editor',
        managedBoards: basic.managedBoards || []
      };
      return enhanced;
    };

    return {
      loadUser: function () {
        if (!$rootScope.user || !$rootScope.user.name) {
          $rootScope.user = {};
          $http.get('/users/me').then(function (res) {
            $rootScope.user = transformUser((res && res.data) || {});
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
            self.loadUser();
            return true;
          }
          return false;
        });
      },
      logout: function () {
        var self = this;
        return $http.post('/users/logout').then(function () {
          self.resetUser();
        });
      },
      changePassword: function (userId, pwd) {
        return $http.post('/users/' + userId, {password: pwd});
      },
      registerAdmin: function (fields) {
        fields.role = 'admin';
        return $http.post('/users', fields);
      },
      registerEditor: function (fields) {
        fields.role = 'editor';
        return $http.post('/users', fields);
      },
      setUser: function (user) {
        $rootScope.user = transformUser(user);
        return $rootScope.user;
      },
      user: function () {
        this.loadUser();
        return $rootScope.user;
      },
      resetUser: function () {
        $rootScope.user = transformUser({});
        $rootScope.$broadcast('user:logout');
      }
    };
  };
  authFactory.$inject = ['$rootScope', '$http'];

  return authFactory;
});