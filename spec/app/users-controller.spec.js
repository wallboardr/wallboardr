var loader = require('../unit-loader');

describe('The UsersController', function () {
  var scope, http, auth, ctlr;
  beforeEach(function () {
    scope = { login: {}, '$on': function () {} };
    http = { post: function () {} };
    auth = { setUser: function () {}, login: function () {} };
    ctlr = loader.loadSubject('app/controllers/users');
  });

  describe('signin', function () {
    it('sets client error if form not valid', function () {
      ctlr(scope, http, auth);

      scope.signin({ $valid: false });

      expect(scope.login.clientError).toBe(true);
    });

    it('makes post call to login if form valid', function () {
      spyOn(auth, 'login').andReturn({ then: function () {} });
      ctlr(scope, http, auth);

      scope.signin({ $valid: true });

      expect(auth.login).toHaveBeenCalled();
    });

    it('clears server and client errors', function () {
      spyOn(auth, 'login').andReturn({ then: function () {} });
      scope.login.clientError = true;
      scope.login.serverError = true;
      ctlr(scope, http, auth);

      scope.signin({ $valid: true });

      expect(scope.login.clientError).toBe(false);
      expect(scope.login.serverError).toBe(false);
    });

    it('sets server error if post returns without user', function () {
      spyOn(auth, 'login').andReturn({ then: function (fn) { fn.call(null, false); } });
      ctlr(scope, http, auth);

      scope.signin({ $valid: true });

      expect(scope.login.serverError).toBe(true);
    });

    it('clears login form if post returns successfully', function () {
      var goodUser = { name: 'noahbate', role: 'admin' };
      scope.loginUser = { pass: '123' };
      spyOn(auth, 'login').andReturn({ then: function (fn) { fn.call(null, goodUser); } });
      spyOn(auth, 'setUser');
      ctlr(scope, http, auth);

      scope.signin({ $valid: true });

      expect(auth.login).toHaveBeenCalledWith(scope.loginUser);
      expect(scope.loginUser).toEqual({});
    });
  });
});