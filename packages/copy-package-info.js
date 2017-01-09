const fs = require('fs');
const mkdirp = require('mkdirp');
const pkg = require('../package.json');

mkdirp.sync(__dirname + '/../output/sync');
mkdirp.sync(__dirname + '/../output/async');

const FIELDS_TO_COPY = [
  'version',
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
  __dirname + '/../output/sync/package.json',
  JSON.stringify(syncPackage, null, '  ') + '\n'
);
fs.writeFileSync(
  __dirname + '/../output/async/package.json',
  JSON.stringify(asyncPackage, null, '  ') + '\n'
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
  fs.writeFileSync(__dirname + '/../output/sync/' + file, src);
  fs.writeFileSync(__dirname + '/../output/async/' + file, src);
});


fs.writeFileSync(__dirname + '/../output/sync/README.md', fs.readFileSync(__dirname + '/SYNC_README.md'));
fs.writeFileSync(__dirname + '/../output/async/README.md', fs.readFileSync(__dirname + '/ASYNC_README.md'));
