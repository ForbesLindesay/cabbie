const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const throat = require('throat');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const ms = require('ms');
const lsr = require('lsr');
const copyFiles = require('./copy-package-info').default;

function execute(description, name, args, options = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const getStdout = options.getStdout;
    const cwd = path.resolve(options.cwd || __dirname + '/..');
    const env = {...process.env, ...(options.env || {})};
    const child = spawn(name, args, {cwd, env});
    const result = [];
    child.stdout.on('data', buf => result.push({n: 'stdout', buf}));
    child.stderr.on('data', buf => result.push({n: 'stderr', buf}));
    child.on('close', exitCode => {
      const end = Date.now();
      if (!exitCode && !options.silent) {
        console.log(description + ' ' + chalk.magenta('(' + ms(end - start) + ')'));
        console.log();
      }
      let stdout = '';
      if (exitCode || getStdout) {
        result.forEach(v => {
          if (exitCode || !getStdout) {
            process[v.n].write(v.buf);
          } else if (v.n === 'stdout') {
            stdout += v.buf.toString('utf8');
          }
        });
        console.log();
      }
      if (exitCode) reject(new Error('exit code ' + exitCode));
      else resolve(stdout);
    });
  });
}
  /*
  "prerelease": "rm -rf output && npm run build && npm run typecheck",
  "release": "npm run release:sync & npm run release:async",
  "release:sync": "cd output/sync && npm publish",
  "release:async": "cd output/async && npm publish",
  */

function babel(args, BABEL_ENV) {
  const p = require.resolve('.bin/babel');
  return execute(
    `BABEL_ENV=${BABEL_ENV} babel ${args.join(' ')}`,
    p, args, {env: {BABEL_ENV}},
  );
}

function flow(directory, args = []) {
  const p = require.resolve('.bin/flow');
  return execute(
    `CWD=${directory} flow ${args.join(' ')}`,
    p, args, {cwd: directory},
  );
}
function generateFlow(directory, args = []) {
  const p = require.resolve('.bin/flow');
  return execute(
    `CWD=${directory} flow generate ${args[1]}`,
    p, args, {cwd: directory, getStdout: true, silent: true},
  );
}
function generateFlowFiles(mode) {
  const failedPaths = [];
  const successPaths = [];
  return Promise.all(
    lsr.sync(__dirname + '/../output/' + mode + '/src').filter(e => e.isFile()).map(throat(1, entry => {
      /*
      return generateFlow(__dirname + '/../output/' + mode, ['gen-flow-files', entry.fullPath, '--retries', '100']).then(
        result => {
          return result;
        }, () => {
          failedPaths.push(entry.path);
          return fs.readFileSync(entry.fullPath);
        },
      ).then(result => {
        successPaths.push({
          path: entry.path,
          fullPath: __dirname + '/../output/' + mode + '/lib' + entry.path.substr(1) + '.flow',
          src: result,
        });
      });
      */
      const result = fs.readFileSync(entry.fullPath);
      successPaths.push({
        path: entry.path,
        fullPath: __dirname + '/../output/' + mode + '/lib' + entry.path.substr(1) + '.flow',
        src: result,
      });
    })),
  ).then(() => ({successPaths, failedPaths}));
}
function install(directory) {
  return execute(
    `CWD=${directory} npm install`,
    'npm', ['install'], {cwd: directory},
  );
}

function exposeAllTypes(mode) {
  const filename = 'output/' + mode + '/src/index.js';
  const enums = fs.readdirSync('src/enums');
  const imports = [];
  const exports = [];
  const typeExports = [];
  enums.forEach(enumFileName => {
    const name = (
      enumFileName[0].toUpperCase() +
      enumFileName.substr(1).replace(/\-([a-z])/g, (_, l) => l.toUpperCase()).replace(/\.js$/, '')
    );
    const enumSrc = fs.readFileSync(`output/${mode}/src/enums/${enumFileName}`, 'utf8');
    const typeName = /^export type ([A-Za-z]+) =/m.exec(enumSrc)[1];
    imports.push(`import ${name} from './enums/${enumFileName}';`);
    imports.push(`import type ${typeName} from './enums/${enumFileName}';`)
    exports.push(name);
    typeExports.push(typeName);
  });
  const src = fs.readFileSync(filename, 'utf8');
  fs.writeFileSync(
    filename,
    src.split('import')[0] + imports.join('\n') + '\nimport' +
    src.split('import').slice(1).join('import') + '\n' +
    'export {' + exports.join(', ') + '};\n' +
    'export type {' + typeExports.join(', ') + '};\n'
  );
}

async function build(mode) {
  await babel(['src', '--out-dir', 'output/' + mode + '/src'], mode);
  exposeAllTypes(mode);
  copyFiles(mode);
  await install(__dirname + '/../output/' + mode);
  await flow(__dirname + '/../output/' + mode, ['stop']);
  await flow(__dirname + '/../output/' + mode);
  const flowFiles = await generateFlowFiles(mode);
  await babel(['output/' + mode + '/src', '--out-dir', 'output/' + mode + '/lib'], mode);
  lsr.sync(__dirname + '/../output/' + mode + '/lib').forEach(entry => {
    if (entry.isFile()) {
      fs.writeFileSync(entry.fullPath, fs.readFileSync(entry.fullPath, 'utf8').replace(/\@flow/g, ''));
    }
  });
  flowFiles.successPaths.forEach(file => {
    console.log(chalk.green(file.path))
    fs.writeFileSync(file.fullPath, file.src);
  });
  flowFiles.failedPaths.forEach(path => console.log(chalk.red(path)));
  rimraf.sync(__dirname + '/../output/' + mode + '/src');
}
async function buildTest(mode) {
  await babel(['test/src/src', '--out-dir', 'test/' + mode + '/src'], mode);
  await flow(__dirname + '/../test/' + mode, ['stop']);
  await flow(__dirname + '/../test/' + mode);
}


/*
  "prebuild:test": "babel-node test/copy-output-packages",
  "build:test": "npm run build:test:sync & npm run build:test:async",
  "build:test:sync": "BABEL_ENV=sync babel test/src --out-dir test/sync",
  "build:test:async": "BABEL_ENV=async babel test/src --out-dir test/async",
  "typecheck:test": "npm run typecheck:test:sync",
  "typecheck:test:sync": "cd test/sync && flow stop && flow",
  */
async function run() {
  const isOnlyTests = process.argv.indexOf('--only-tests') !== -1;
  const isAll = process.argv.indexOf('--all') !== -1;
  if (!isOnlyTests) {
    rimraf.sync(__dirname + '/../output');
    await Promise.all([
      build('sync'),
      build('async'),
    ]);
  }
  if (isOnlyTests || isAll) {
    rimraf.sync(__dirname + '/../test/sync');
    rimraf.sync(__dirname + '/../test/async');
    await execute(
      `babel-node test/copy-output-packages`,
      'babel-node', ['test/copy-output-packages'],
    );
    await Promise.all([
      buildTest('sync'),
      buildTest('async'),
    ]);
  }
}
run().catch(ex => {
  setTimeout(() => { throw ex; }, 0);
});
