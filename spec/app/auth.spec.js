var loader = require('../unit-loader');

describe('The auth service', function () {
  var angularMock, authFactory, service, rootScope, cookies;
  beforeEach(function () {
    angularMock = {
      copy: function (input, b) {
        if (b) {
          b.name = input.name;
          b.loggedIn = input.loggedIn;
        }
        return input;
      }
    };
    authFactory = loader.loadSubject('app/services/auth', [angularMock]);
    rootScope = {};
    cookies = {};
  });

  describe('setCookieUser', function () {
    beforeEach(function () {
      spyOn(angularMock, 'copy').andCallThrough();
    });

    it('sets a user with no role if no cookie exists', function () {
      service = authFactory(rootScope, cookies);

      service.setCookieUser();

      expect(angularMock.copy).toHaveBeenCalled();
      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBe(false);
      expect(rootScope.user.name).toBe('');
    });

    it('does not set user if one already exists', function () {
      rootScope.user = {name:'Noah'};
      service = authFactory(rootScope, cookies);

      service.setCookieUser();

      expect(angularMock.copy).toHaveBeenCalled();
      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBeFalsy();
      expect(rootScope.user.name).toBe('Noah');
    });

    it('uses the wbuser cookie when it exists', function () {
      cookies.wbuser = 'noah||admin';
      service = authFactory(rootScope, cookies);

      service.setCookieUser();

      expect(angularMock.copy).toHaveBeenCalled();
      expect(rootScope.user).toBeDefined();
      expect(rootScope.user.loggedIn).toBe(true);
      expect(rootScope.user.isEditor).toBe(false);
      expect(rootScope.user.isAdmin).toBe(true);
      expect(rootScope.user.name).toBe('noah');
    });
  });

  describe('setUser', function () {
    it('sets user to root scope', function () {
      service = authFactory(rootScope, cookies);

      var result = service.setUser({name: 'noahbate', role: 'editor'});

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
      service = authFactory(rootScope, cookies);
      spyOn(service, 'setCookieUser');

      var result = service.user();

      expect(service.setCookieUser).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.name).toBe('Noah Bate');
    });
  });

  describe('resetUser', function () {
    beforeEach(function () {
      rootScope.$broadcast = function () {};
    });

    it('sets the root scope user to not logged in', function () {
      spyOn(angularMock, 'copy').andCallThrough();
      rootScope.user = { name: 'NoahB', loggedIn: true };
      service = authFactory(rootScope, cookies);

      service.resetUser();

      expect(angularMock.copy).toHaveBeenCalled();
      expect(rootScope.user.loggedIn).toBe(false);
      expect(rootScope.user.name).toBe('');
    });

    it('sends logout event to children scopes', function () {
      spyOn(rootScope, '$broadcast');
      service = authFactory(rootScope, cookies);

      service.resetUser();

      expect(rootScope.$broadcast).toHaveBeenCalledWith('logout');
    });
  });

});

