'use strict';

var chromedriver = require('chromedriver');
var getBrowser = require('../');

var LOCAL = !process.env.CI && process.argv[2] !== 'sauce';
var browserCount = 0;

module.exports = function (options) {
  if (LOCAL) {
    if (browserCount === 0) {
      chromedriver.start();
    }
    browserCount++;
    var browser = getBrowser('http://localhost:9515/', {}, options);
    browser.on('disposed', function () {
      if (0 === --browserCount) {
        chromedriver.stop();
      }
    });
    return browser;
  } else {
    return getBrowser('http://cabbie:6f1108e1-6b52-47e4-b686-95fa9eef2156@ondemand.saucelabs.com/wd/hub', {browserName: 'chrome'}, options);
  }
};