'use strict';

console.log('# Test Sync');
console.log();

var assert = require('assert');
var getBrowser = require('../');
var chromedriver = require('chromedriver');

chromedriver.start();

var browser = getBrowser('http://localhost:9515/', {}, {mode: 'sync', debug: true});

browser.navigateTo('http://www.example.com');
assert(browser.getElement('h1').text() === 'Example Domain');

browser.dispose();

chromedriver.stop();

console.log();
