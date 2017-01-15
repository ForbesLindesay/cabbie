const fs = require('fs');
const lsr = require('lsr');
const mkdir = require('mkdirp');

function populateNodeModules(name, output) {
  mkdir.sync(__dirname + '/' + output + '/node_modules/cabbie-' + name);
  lsr.sync(__dirname + '/../output/' + name).forEach(entry => {
    const path = entry.path.startsWith('./node_modules/')
      ? __dirname + '/' + output + '/' + entry.path.substr(1)
      : __dirname + '/' + output + '/node_modules/cabbie-' + name + entry.path.substr(1);
    if (entry.isDirectory()) {
      mkdir.sync(path);
    } else {
      fs.writeFileSync(path, fs.readFileSync(entry.fullPath));
    }
  });
}
function copy(name) {
  populateNodeModules(name, name);
  function copyFile(source, destination) {
    const src = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(destination, src);
  }
  copyFile(__dirname + '/src/.flowconfig', __dirname + '/' + name + '/.flowconfig');
  copyFile(__dirname + '/../scripts/.babelrc', __dirname + '/' + name + '/.babelrc');
  fs.writeFileSync(
    __dirname + '/' + name + '/package.json',
    JSON.stringify({name: 'cabbie-test', version: '0.0.0', dependencies: {'cabbie-sync': '*', 'cabbie-async': '*'}}),
  );
}
populateNodeModules('async', 'src');
copy('async');
copy('sync');
