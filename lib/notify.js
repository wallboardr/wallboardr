var Primus = require('primus');
var boardListeners = {},
    addBoardListener = function (board, spark) {
      if (!boardListeners[board]) {
        boardListeners[board] = [];
      }
      boardListeners[board].push(spark);
      console.log('Incoming bogie: ' + board);
    },
    removeBoardListener = function (board, spark) {
      var lindex = 0;
      if (board) {
        for (; lindex < boardListeners[board].length; lindex += 1) {
          if (spark.id === boardListeners[board][lindex].id) {
            boardListeners[board].splice(lindex, 1);
            console.log('Bogie bugging out: ' + board);
            break;
          }
        }
      }
    },
    notifyBoardListeners = function (board) {
      var lindex = 0;
      if (board && boardListeners[board]) {
        for (; lindex < boardListeners[board].length; lindex += 1) {
          boardListeners[board][lindex].write({type: 'HUP'});
        }
        console.log('Notifying bogies about update: ' + board);
      }
    },
    notifyAllListeners = function (signal) {
      var lindex = 0, hop = Object.prototype.hasOwnProperty;
      for (var board in boardListeners) {
        if (hop.call(boardListeners, board)) {
          for (; lindex < boardListeners[board].length; lindex += 1) {
            boardListeners[board][lindex].write({type: signal});
          }
          lindex = 0;
        }
      }
      console.log('Notifying all browsers: ' + signal);
    };

module.exports = {
  listen: function (server) {
    var primus = new Primus(server, { transformer: 'websockets' });

    primus.on('connection', function (spark) {
      if (spark.query && spark.query.board) {
        addBoardListener(spark.query.board, spark);
      } else {
        console.log('Viper here, waiting to engage bogies...');
        spark.on('data', function (data) {
          if (data.updated) {
            if (data.updated === 'all') {
              notifyAllListeners('HUP');
            } else {
              notifyBoardListeners(data.updated);
            }
          } else if (data.upgrade) {
            notifyAllListeners('UPGRADE');
          }
        });
      }
    });

    primus.on('disconnection', function (spark) {
      if (spark.query && spark.query.board) {
        removeBoardListener(spark.query.board, spark);
      } else {
        console.log('Viper bugging out...');
      }
    });
  },
  notifyBoards: notifyAllListeners
};