var mustache = require('mustache'),
    less = require('less'),
    join = require('path').join,
    fs = require('fs'),
    runLess = false,
    compileLess = function (file, lessType) {
      if (!runLess) {
        return;
      }
      var lessData = readTemplate(file),
          cssFile =  '../public/assets/css/' + lessType + '-plugins.css',
          opts = {
            paths: [join(__dirname, '../less')],
            filename: lessType + '-plugins.less'
          };

      less.render(lessData, opts, function (err, css) {
        if (err) {
          console.warn('Less compile failed for ' + cssFile);
          console.warn(err.message);
          return;
        }
        writeFile(cssFile, css);
        console.log('Finished compiling ' + cssFile);
      })
    },
    styleExists = function (plugObj) {
      var filename = join(__dirname, '../public/assets/plugins',  plugObj.name, plugObj.type + '.less');
      return fs.existsSync(filename);
    },
    createViewData = function (plugins, type, config) {
      return {
        plugins: plugins.map(function (name) {
          return {name: name, type: type};
        }),
        config: config && Object.keys(config).map(function (key) {
          return {
            key: key,
            value: JSON.stringify(config[key])
          };
        }) || []
      };
    },
    readTemplate = function (file) {
      return fs.readFileSync(join(__dirname, file), {encoding: 'utf8'});
    },
    writeFile = function (file, data) {
      fs.writeFileSync(join(__dirname, file), data);
      return file;
    },
    processPlugin = function (plugins, jsTemplate, lessTemplate, type, lessType, config) {
      var viewData = createViewData(plugins, type, config),
          jsFileData = mustache.render(jsTemplate, viewData),
          lessFileData, lessFilename;
      console.log('Processing ' + type + ' plugin templates');
      writeFile('../public/assets/plugins/plugin-list-' + type + '.js', jsFileData);
      viewData.plugins = viewData.plugins.filter(styleExists);
      lessFileData = mustache.render(lessTemplate, viewData);
      lessFilename = writeFile('../less/' + lessType + '-plugins.less', lessFileData);
      compileLess(lessFilename, lessType);
    },
    createPluginFiles = function (plugins, config) {
      var jsTemplate = readTemplate('./plugin-list.template.js'),
          lessTemplate = readTemplate('./plugins.template.less');
      processPlugin(plugins, jsTemplate, lessTemplate, 'admin', 'app', config);
      processPlugin(plugins, jsTemplate, lessTemplate, 'screen', 'display', config);
    }
    load = function (file) {
      console.log('Reading plugins file: ' + file);
      var plugins = require(file);
      runLess = plugins.runLess;
      if (plugins.loadPlugins && plugins.loadPlugins.length) {
        console.log('Loading ' + plugins.loadPlugins.length + ' plugins');
        createPluginFiles(plugins.loadPlugins, plugins.config);
      }
    };

module.exports = {
  load: load
};