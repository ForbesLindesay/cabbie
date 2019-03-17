// @flow
import fs from 'fs';
import assert from 'assert';
import {fork} from 'child_process';
import request from 'sync-request';
import createCabbie, {startChromedriver} from 'cabbie-async';
import runTest from './run-test';

if (process.argv.indexOf('--help') !== -1 || process.argv.indexOf('-h') !== -1) {
  console.log('node test [options]');
  console.log('');
  console.log('  -h --help  This help text');
  console.log('  -s --sauce Run tests in sauce labs');
  console.log('             (default if CI env variable is present)');
  console.log('  -l --local Run tests locally (default)');
  console.log('  -r --record Record test runs to be replayed later');
  process.exit(0);
}

const RECORD = process.argv.includes('--record') || process.argv.includes('-r');
const LOCAL_FLAG = process.argv.includes('--local') || process.argv.includes('-l');
const SAUCE_FLAG = process.argv.includes('--sauce') || process.argv.includes('-s');

if (LOCAL_FLAG && SAUCE_FLAG) {
  console.error('You cannot use sauce and local in one test run.');
  console.error('Run node test --help for help');
  process.exit(1);
}

const LOCAL = !SAUCE_FLAG;

function doReplacements(source: string, replacements: {[key: string]: string}): string {
  Object.keys(replacements).forEach(function(key) {
    source = source.split(key).join(replacements[key]);
  });
  return source;
}

function createPage(filename: string, replacements?: {[key: string]: string}): string {
  var html = fs.readFileSync(filename, 'utf8');
  if (replacements) {
    html = doReplacements(html, replacements);
  }
  const res = request('POST', 'https://tempjs.org/create', {json: {html: html}}).getBody('utf8');
  const parsed = JSON.parse(res);
  return 'https://tempjs.org' + parsed.path;
}

const onDispose = [];
async function dispose() {
  while (onDispose.length) {
    const value = onDispose.pop();
    try {
      await value();
    } catch (ex) {
      console.error(ex.stack);
    }
  }
}
async function run() {
  if (LOCAL && RECORD) {
    console.log('starting chromedriver');
    startChromedriver();
  }
  const remote = LOCAL
    ? 'http://localhost:7883'
    : 'http://cabbie:6f1108e1-6b52-47e4-b686-95fa9eef2156@ondemand.saucelabs.com/wd/hub';
  const options = LOCAL
    ? {debug: true, httpDebug: false}
    : {debug: true, httpDebug: false, capabilities: {browserName: 'chrome'}};
  console.log('creating driver');
  const driver = createCabbie(remote, options);
  try {
    const location = createPage(__dirname + '/../../demoPage.html', {
      '{{linked-page}}': createPage(__dirname + '/../../linkedTo.html'),
    });
    await runTest(driver, location);
  } finally {
    await driver.dispose();
  }
}

async function onProxyReady() {
  try {
    await run();
    process.exit(0);
  } catch (ex) {
    console.error(ex.stack || ex.message || ex);
    process.exit(1);
  }
}
// if (LOCAL) {
//   const proxyArgs = RECORD ? ['--record'] : [];
//   const proxy = fork(require.resolve('../../record'), proxyArgs, {stdio: ['inherit', 'inherit', 'inherit', 'ipc']});

//   process.on('exit', () => {
//     proxy.kill();
//   });
//   proxy.unref();
//   proxy.on('error', err => {
//     dispose();
//     throw err;
//   });
//   proxy.on('exit', status => {
//     dispose();
//     if (status) {
//       console.error('proxy exited with non-zero status code');
//       process.exit(status);
//     }
//   });
//   proxy.on('message', message => {
//     if (message.status === 'started') {
//       onProxyReady();
//     }
//   });
// } else {
//   onProxyReady();
// }

async function run() {
  const options = {debug: true, httpDebug: true, capabilities: {browserName: 'chrome'}};
  console.log('creating driver');

  const remote = 'http://localhost:4444/wd/hub';
  const driver = createCabbie(remote, options);
  try {
    const location = createPage(__dirname + '/../../demoPage.html', {
      '{{linked-page}}': createPage(__dirname + '/../../linkedTo.html'),
    });
    await runTest(driver, location);
  } finally {
    await driver.dispose();
  }
}
async function onProxyReady() {
  try {
    await run();
    process.exit(0);
  } catch (ex) {
    console.error(ex.stack || ex.message || ex);
    process.exit(1);
  }
}
onProxyReady();
