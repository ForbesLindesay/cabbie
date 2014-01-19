'use strict';

console.log('# Test Sync');
console.log();

var assert = require('assert');
var getBrowser = require('./get-browser');

var browser = getBrowser({mode: 'sync', debug: true});

browser.navigateTo('http://www.example.com');
assert(browser.getElement('h1').text() === 'Example Domain');

browser.dispose();

console.log();
