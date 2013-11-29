var loader = require('../unit-loader');

describe('The auth service', function () {
  var authFactory, service, rootScope, http;
  var getPayload, postPayload;
  beforeEach(function () {
    authFactory = loader.loadSubject('app/services/auth');
    rootScope = {};
    http = {
      get: function (url) {
        return {
          then: function (fn) {
            fn(getPayload);
          }
        };
      },
      post: function (url) {
        return {
          then: function (fn) {
            fn(postPayload);
          }
        };
      }
    };
  });

  describe('whoAmI', function () {

    it('calls the correct deployd URL', function () {
      spyOn(http, 'get').andCallThrough();
      service = authFactory(rootScope, http);

      service.whoAmI();

      expect(http.get).toHaveBeenCalledWith('/users/me');
    });

    it('sets a user with no role if http returns no data', function () {
      getPayload = {};
      service = authFactory(rootScope, http);

      service.whoAmI();

      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBe(false);
      expect(rootScope.user.name).toBeFalsy();
    });

    it('does not set user if one already exists', function () {
      rootScope.user = {name:'Noah'};
      getPayload = {data:{username:'Colin', role:'admin'}};
      service = authFactory(rootScope, http);

      service.whoAmI();

      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBeFalsy();
      expect(rootScope.user.name).toBe('Noah');
    });

    it('uses the result of the get as the user', function () {
      getPayload = {data:{username:'noah', role:'admin'}};
      service = authFactory(rootScope, http);

      service.whoAmI();

      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBe(true);
      expect(rootScope.user.isEditor).toBe(false);
      expect(rootScope.user.isAdmin).toBe(true);
      expect(rootScope.user.name).toBe('noah');
    });
  });

  describe('setUser', function () {
    it('sets user to root scope', function () {
      service = authFactory(rootScope, http);

      var result = service.setUser({username: 'noahbate', role: 'editor'});

      expect(rootScope.user).toBeDefined();
      expect(result).toBe(rootScope.user);
      expect(result.isAdmin).toBe(false);
      expect(result.isEditor).toBe(true);
      expect(result.name).toBe('noahbate');
    });
  });

  describe('user', function () {
    it('sets up the cookie user and returns it', function () {
      rootScope.user = { name: 'Noah Bate' };
      service = authFactory(rootScope, http);
      spyOn(service, 'whoAmI');

      var result = service.user();

      expect(service.whoAmI).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.name).toBe('Noah Bate');
    });
  });

  describe('resetUser', function () {
    beforeEach(function () {
      rootScope.$broadcast = function () {};
    });

    it('sets the root scope user to not logged in', function () {
      rootScope.user = { username: 'NoahB', loggedIn: true };
      service = authFactory(rootScope, http);

      service.resetUser();

      expect(rootScope.user.loggedIn).toBe(false);
      expect(rootScope.user.name).toBeFalsy();
    });

    it('sends logout event to children scopes', function () {
      spyOn(rootScope, '$broadcast');
      service = authFactory(rootScope, http);

      service.resetUser();

      expect(rootScope.$broadcast).toHaveBeenCalledWith('user:logout');
    });
  });

});

