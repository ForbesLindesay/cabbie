const fs = require('fs');
const lsr = require('lsr');
const mkdir = require('mkdirp');

function copy(name) {
  mkdir.sync(__dirname + '/' + name + '/node_modules/cabbie-' + name);
  lsr.sync(__dirname + '/../output/' + name).forEach(entry => {
    const path = (
      entry.path.startsWith('./node_modules/')
      ? __dirname + '/' + name + '/' + entry.path.substr(1)
      : __dirname + '/' + name + '/node_modules/cabbie-' + name + entry.path.substr(1)
    );
    if (entry.isDirectory()) {
      mkdir.sync(path);
    } else {
      fs.writeFileSync(path, fs.readFileSync(entry.fullPath));
    }
  });
  function addModule(moduleName) {
    mkdir.sync(__dirname + '/' + name + '/node_modules/' + moduleName);
    lsr.sync(__dirname + '/../node_modules/' + moduleName).forEach(entry => {
      const path = (
        __dirname + '/' + name + '/node_modules/' + moduleName + entry.path.substr(1)
      );
      if (entry.isDirectory()) {
        mkdir.sync(path);
      } else {
        fs.writeFileSync(path, fs.readFileSync(entry.fullPath));
      }
    });
  }
  addModule('testit');
  addModule('sync-request');
  function copyFile(filename, from = filename) {
    const src  = fs.readFileSync(__dirname + '/../scripts/' + from, 'utf8');
    fs.writeFileSync(__dirname + '/' + name + '/' + filename, src);
  }
  copyFile('.flowconfig', 'test-flowconfig');
  copyFile('.babelrc');
  fs.writeFileSync(__dirname + '/' + name + '/package.json', JSON.stringify({
    name: 'cabbie-test',
    version: '0.0.0',
    dependencies: {
      'cabbie-sync': '*',
      'cabbie-async': '*',
    },
  }));
}
copy('async');
copy('sync');
