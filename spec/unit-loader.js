var path = require('path'),
    readdirp = require('readdirp'),
    subFnCache = {},
    sutRoot = path.resolve(process.env.SUT_ROOT || __dirname + '/../public/assets/js') + '/';

//console.log(sutRoot);
global.define = function (arr, fn) {
  global._subFn = fn;
};

var cacheFile = function (fullFile) {
  if (!subFnCache[fullFile]) {
    require(fullFile);
    if (global._subFn && typeof global._subFn === 'function') {
      subFnCache[fullFile] = global._subFn;
    }
    global._subFn = null;
  }
  return subFnCache[fullFile];
}

readdirp({root: sutRoot, fileFilter: '*.js'}).on('data', function (entry) {
  if (entry.name.substr(-3) === '.js' && !(entry.name === 'main.js' || entry.name === 'boards.js')) {
    cacheFile(entry.fullPath);
  }
});

module.exports = {
  loadSubject: function (file, deps) {
    var subject = null,
        fullFile = sutRoot + file;
    if (fullFile.substr(-3) !== '.js') {
      fullFile += '.js';
    }
    subject = cacheFile(fullFile).apply(null, deps || []);

    return subject;
  }
};