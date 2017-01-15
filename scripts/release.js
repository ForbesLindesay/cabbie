const fs = require('fs');
const spawnSync = require('cross-spawn').sync;

const src = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

function transform(name, fn) {
  const input = JSON.parse(fs.readFileSync(name, 'utf8'));
  fn(input);
  fs.writeFileSync(name, JSON.stringify(input, null, '  ') + '\n');
}
transform(__dirname + '/../output/async/package.json', p => p.version = src.version);
transform(__dirname + '/../output/sync/package.json', p => p.version = src.version);
transform(__dirname + '/../core/package.json', p => {
  p.version = src.version;
  p.dependencies['cabbie-async'] = src.version;
  p.dependencies['cabbie-sync'] = src.version;
});

function publish(directory) {
  const result = spawnSync('npm publish', {cwd: directory});
  if (res.status !== 0) {
    throw new Error(res.stderr.toString());
  }
  if (res.error) {
    if (typeof res.error === 'string')
      res.error = new Error(res.error);
    throw res.error;
  }
}
publish(__dirname + '/../output/async/');
publish(__dirname + '/../output/sync/');
publish(__dirname + '/../core/');
