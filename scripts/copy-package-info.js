const fs = require('fs');
const mkdirp = require('mkdirp');
const pkg = require('../package.json');

export default function copyFiles(mode) {
  mkdirp.sync(__dirname + '/../output/' + mode);

  const FIELDS_TO_COPY = [
    'version',
    'main',
    'keywords',
    'repository',
    'author',
    'constributors',
    'license',
  ];
  function getPackage(options, dependencies) {
    FIELDS_TO_COPY.forEach(field => {
      options[field] = pkg[field];
    });
    options.dependencies = {};
    dependencies.forEach(dependency => {
      options.dependencies[dependency] = pkg.devDependencies[dependency] || pkg.dependencies[dependency];
    });

    options.files = [
      "lib/"
    ];
    return options;
  }
  const syncPackage = getPackage(
    {
      name: 'cabbie-sync',
      description: 'A synchronous webdriver client',
    },
    ['flow-runtime', 'ms', 'sync-request']
  );
  const asyncPackage = getPackage(
    {
      name: 'cabbie-async',
      description: 'An asynchronous webdriver client',
    },
    ['flow-runtime', 'ms', 'then-request']
  );

  fs.writeFileSync(
    __dirname + '/../output/' + mode + '/package.json',
    JSON.stringify(mode === 'sync' ? syncPackage : asyncPackage, null, '  ') + '\n'
  );

  const FILES_TO_COPY = [
    '.babelrc',
    '.flowconfig',
    'LICENSE',
  ];
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
    fs.readFileSync(__dirname + '/' + mode.toUpperCase() + '_README.md')
  );
};
