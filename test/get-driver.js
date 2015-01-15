'use strict';

var chromedriver = require('chromedriver');
var getDriver = require('../');

var LOCAL_FLAG = (process.argv.indexOf('--local') !== -1 ||
                  process.argv.indexOf('-l') !== -1);
var SAUCE_FLAG = (process.argv.indexOf('--sauce') !== -1 ||
                  process.argv.indexOf('-s') !== -1);

if (LOCAL_FLAG && SAUCE_FLAG) {
  console.error('You cannot use sauce and local in one test run.');
  console.error('Run node test --help for help');
  process.exit(1);
}

var LOCAL = LOCAL_FLAG || (!process.env.CI && !SAUCE_FLAG);
var browserCount = 0;

module.exports = function (options) {
  if (LOCAL) {
    if (browserCount === 0) {
      chromedriver.start();
    }
    browserCount++;
    var browser = getDriver('http://localhost:9515/', {}, options);
    browser.on('disposed', function () {
      if (0 === --browserCount) {
        chromedriver.stop();
      }
    });
    return browser;
  } else {
    return getDriver('http://cabbie:6f1108e1-6b52-47e4-b686-95fa9eef2156@ondemand.saucelabs.com/wd/hub', {browserName: 'chrome'}, options);
  }
};
