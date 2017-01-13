const fs = require('fs');
const mkdirp = require('mkdirp');
const pkg = require('../package.json');

export default function copyFiles(mode) {
  mkdirp.sync(__dirname + '/../output/' + mode);

  const FIELDS_TO_COPY = ['version', 'main', 'keywords', 'repository', 'author', 'constributors', 'license'];
  function getPackage(options, dependencies) {
    FIELDS_TO_COPY.forEach(field => {
      options[field] = pkg[field];
    });
    options.dependencies = {};
    dependencies.sort().forEach(dependency => {
      options.dependencies[dependency] = pkg.devDependencies[dependency] || pkg.dependencies[dependency];
    });

    options.files = ['lib/'];
    return options;
  }
  const syncPackage = getPackage({name: 'cabbie-sync', description: 'A synchronous webdriver client'}, [
    'chalk',
    'flow-runtime',
    'ms',
    'sync-request',
    'babel-runtime',
  ]);
  const asyncPackage = getPackage({name: 'cabbie-async', description: 'An asynchronous webdriver client'}, [
    'chalk',
    'flow-runtime',
    'ms',
    'then-request',
    'babel-runtime',
  ]);

  fs.writeFileSync(
    __dirname + '/../output/' + mode + '/package.json',
    JSON.stringify(mode === 'sync' ? syncPackage : asyncPackage, null, '  ') + '\n',
  );

  const FILES_TO_COPY = ['.babelrc', '.flowconfig', 'LICENSE'];
  FILES_TO_COPY.forEach(file => {
    let src;
    if (fs.existsSync(__dirname + '/' + file)) {
      src = fs.readFileSync(__dirname + '/' + file);
    } else {
      src = fs.readFileSync(__dirname + '/../' + file);
    }
    fs.writeFileSync(__dirname + '/../output/' + mode + '/' + file, src);
  });

  fs.writeFileSync(
    __dirname + '/../output/' + mode + '/README.md',
    fs.readFileSync(__dirname + '/' + mode.toUpperCase() + '_README.md'),
  );
}
