'use strict';

var chromedriver = require('chromedriver');
var getBrowser = require('../');

var USE_CHROMEDRIVER = true;
var browserCount = 0;

module.exports = function (options) {
  if (USE_CHROMEDRIVER) {
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
  }
};