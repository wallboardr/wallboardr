/*jshint node:true */
'use strict';
var Sproute = require('./sproute/app');
var http = require('http');
var urlParser = require('url').parse;
var app = new Sproute(__dirname);
var packageInfo = require('./package.json');
var notifier = require('./lib/notify');
notifier.listen(app.rawServer);

var urlHandler = function (block, next) {
  var auth, user, pass, parsedUrl, opts = {};
  //pause parsing and decode request
  var expr = block.expr.split(' ');
  var url = expr[0];
  if (expr.length >= 3) {
    user = expr[1];
    pass = expr[2];
    auth = !!user && !!pass;
  }
  //request the data then continue parsing
  var html = '';
  if (!url) {
    next();
    return;
  }
  parsedUrl = urlParser(url);
  opts.hostname = parsedUrl.hostname;
  opts.port = parsedUrl.port;
  opts.path = parsedUrl.path;
  if (parsedUrl.auth) {
    opts.auth = parsedUrl.auth;
  }
  if (auth) {
    opts.auth = user + ':' + pass;
  }
  http.get(opts, function (res) {
    res.on('data', function (chunk) {
      html += chunk;
    });
    res.on('end', function () {
      next(html);
    });
  }).on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
};

// Hook to fetch a URL and render it in place (used for proxying)
app.hooks.fetch = urlHandler;

app.server.get('/json/:page', function (req, res) {
  var url = req.params.page,
      parsedUrl = urlParser(url),
      opts = {
        headers: { 'Accept': 'application/json' },
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        auth: parsedUrl.auth
      },
      payload = '';
  if (opts.auth) {
    console.log('Auth found: ' + opts.auth);
  }
  res.set('Content-Type', 'application/json');
  http.get(opts, function (ret) {
    ret.on('data', function (chunk) {
      payload += chunk;
    });
    ret.on('end', function () {
      res.send(payload);
    });
  }).on('error', function(e) {
    console.log('problem with request: ' + e.message);
    res.send(500, e.message);
  });
});

app.server.get('/api/shared/:boardid', function (req, res) {
  var boardId = req.params.boardid,
      where = {'shareable': true, 'board': {'$ne': boardId}};
  app.storage.db.collection('screens').find(where, {}, {}, app.response(req, res));
});

// Hook to set a cookie
app.hooks.cookie = function (block, next) {
  var expr = block.expr.split(' ');
  var name = expr.shift();
  var value = '';
  if (expr.length) {
    value = expr.join(' ');
  }
  this.cookie(name, value);
  next();
};

// Hook to print package package
console.log('Registering packageInfo');
app.hooks.packageinfo = function (block, next) {
    if (packageInfo[block.expr]) {
        next(packageInfo[block.expr]);
    } else {
        next();
    }
};