/*jshint node:true */
'use strict';
var Sproute = require('./sproute/app');
var http = require('http');

var app = new Sproute('.');
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

