var deployd = require('deployd');
var notifier = require('./lib/notify');

process.chdir(__dirname);
var server = deployd({
  port: process.env.PORT || 8000,
  env: 'development',
  db: {
    host: 'localhost',
    port: 27017,
    name: 'wallboardr'
  }
});

notifier.listen(server);

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});