import {writeFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import {sync as spawnSync} from 'cross-spawn';
import runInference from './inference';
import toJson from './to-json-docs';

const inference = runInference(__dirname + '/../src/index.js');
const documentation = toJson(inference);

mkdirp(__dirname + '/../output/www');
writeFileSync(
  __dirname + '/../output/www/documentation.js',
  'module.exports = (' + JSON.stringify(documentation, null, '  ') + ')',
);
console.dir(documentation, {depth: 1, colors: true});

const cp = spawnSync(require.resolve('.bin/babel'), ['www/ui/', '--out-dir', 'output/www/ui'], {
  stdio: 'inherit',
});
if (cp.error) {
  throw cp.error;
}
if (cp.statusCode) {
  process.exit(cp.statusCode);
}
require('./server');
