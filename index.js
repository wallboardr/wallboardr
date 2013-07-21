/*jshint node:true */
'use strict';
var Sproute = require('./sproute/app');
var http = require('http');

var app = new Sproute('.');

// Hook to fetch a URL and render it in place (used for proxying)
app.hooks.fetch = function (block, next) {
  //pause parsing and decode request
  var expr = block.expr.split(' ');
  var url = expr[0];
  //request the data then continue parsing
  var html = '';
  if (!url) {
    next();
    return;
  }
  http.get(url, function (res) {
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