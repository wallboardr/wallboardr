var fs = require('fs'),
    path = require('path'),
    vm = require('vm'),
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
    return vm.runInNewContext(fs.readFileSync(sutRoot + file, 'utf8'), {define: define}, sutRoot + file);
  }
};