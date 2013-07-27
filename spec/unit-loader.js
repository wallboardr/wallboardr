var fs = require('fs'),
    path = require('path'),
    sutRoot = path.resolve(process.env.SUT_ROOT || __dirname + '/../assets/js') + '/';

//console.log(sutRoot);

module.exports = {
  loadSubject: function (file, deps) {
    if (file.substr(file.length - 3) !== '.js') {
      file += '.js';
    }
    var define = function (arr, fn) {
      return fn.apply(null, deps || []);
    }
    return eval(fs.readFileSync(sutRoot + file, 'utf8'));
  }
};