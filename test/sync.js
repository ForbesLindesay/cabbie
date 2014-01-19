'use strict';

console.log('# Test Sync');
console.log();

var assert = require('assert');
var getBrowser = require('./get-browser');

var browser = getBrowser({mode: 'sync', debug: true});

browser.sauceJobUpdate({name: 'synchronous', build: process.env.TRAVIS_JOB_ID});
try {
  browser.navigateTo('http://www.example.com');
  assert(browser.getElement('h1').text() === 'Example Domain');
  browser.sauceJobUpdate({passed: true});
} catch (ex) {
  browser.sauceJobUpdate({passed: false});
  browser.dispose();
  throw ex;
}

browser.dispose();

console.log();
