/*jshint node:true */
'use strict';
console.log('Welcome to Wallboardr');
var deployd = require('deployd');
var notifier = require('./lib/notify');
process.chdir(__dirname);

var configFile = process.argv[2] || './config.json';
console.log('Reading config file: ' + configFile);
var config = require(configFile);
// Some environments need to specify the port dynamically.
config.port = process.env.PORT || config.port || 8000;
config.env = config.env || 'development';
var server = deployd(config);

notifier.listen(server);

server.listen();

server.on('listening', function() {
  console.log('Server is in ' + config.env + ' mode on port ' + config.port);
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});