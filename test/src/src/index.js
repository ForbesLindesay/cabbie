// @flow
import fs from 'fs';
import assert from 'assert';
import request from 'sync-request';
import createCabbie from 'cabbie-async';
import chromedriver from 'chromedriver';
import runTest from './run-test';

if (process.argv.indexOf('--help') !== -1 || process.argv.indexOf('-h') !== -1) {
  console.log('node test [options]');
  console.log('');
  console.log('  -h --help  This help text');
  console.log('  -s --sauce Run tests in sauce labs');
  console.log('             (default if CI env variable is present)');
  console.log('  -l --local Run tests locally (default)');
  process.exit(0);
}

const LOCAL_FLAG = (process.argv.indexOf('--local') !== -1 ||
                    process.argv.indexOf('-l') !== -1);
const SAUCE_FLAG = (process.argv.indexOf('--sauce') !== -1 ||
                    process.argv.indexOf('-s') !== -1);

if (LOCAL_FLAG && SAUCE_FLAG) {
  console.error('You cannot use sauce and local in one test run.');
  console.error('Run node test --help for help');
  process.exit(1);
}

const LOCAL = LOCAL_FLAG || (!process.env.CI && !SAUCE_FLAG);

function doReplacements(source: string, replacements: {[key: string]: string}): string {
  Object.keys(replacements).forEach(function (key) {
    source = source.split(key).join(replacements[key]);
  });
  return source;
}

function createPage(filename: string, replacements?: {[key: string]: string}): string {
  var html = fs.readFileSync(filename, 'utf8');
  if (replacements) {
    html = doReplacements(html, replacements);
  }
  const res = request('POST', 'https://tempjs.org/create', {
    json: { html: html }
  }).getBody('utf8');
  const parsed = JSON.parse(res);
  return 'https://tempjs.org' + parsed.path;
}

async function run() {
  if (LOCAL) {
    console.log('starting chromedriver');
    chromedriver.start();
  }
  const remote = (
    LOCAL
    ? 'http://localhost:9515'
    : 'http://cabbie:6f1108e1-6b52-47e4-b686-95fa9eef2156@ondemand.saucelabs.com/wd/hub'
  );
  const options = (
    LOCAL
    ? {debug: true, httpDebug: false}
    : {debug: true, httpDebug: false, browserName: 'chrome'}
  );
  let driver;
  try {
    console.log('creating driver');
    driver = createCabbie(remote, options);
    const location = createPage(__dirname + '/../../demoPage.html', {
      '{{linked-page}}': createPage(__dirname + '/../../linkedTo.html'),
    });
    await runTest(driver, location);
  } finally {
    if (driver) {
      await driver.dispose();
    }
    chromedriver.stop();
  }
}
(async () => {
  try {
    await run();
  } catch (ex) {
    console.error(ex.stack || ex.message || ex);
    process.exit(1);
  }
})();
