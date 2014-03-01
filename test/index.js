'use strict';

console.log('# Test Sync');
console.log();

var assert = require('assert');
var test = require('testit');
var Promise = require('promise');
var getBrowser = require('./get-browser');

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, require('ms')(time + ''));
  });
}

test('it throws an error if you try and get a browser with an invalid mode', function () {
  try {
    var browser = getBrowser({mode: 'foo'});
  } catch (ex) {
    assert(ex instanceof Error);
  }
});

function testBrowser(browser, promise) {
  test('it lets you specify a sauce job name', function () {
    return promise(browser
                   .sauceJobUpdate({
                     name: 'synchronous',
                     build: process.env.TRAVIS_JOB_ID
                   }));
  });
  test('it lets you set timeouts', function () {
    return promise(browser.setTimeouts({
      'implicit': '10s',
      'async': '10s'
    }));
  });
  test('it lets you navigate to a domain', function () {
    return promise(browser.navigateTo('http://www.google.com')).then(function () {
      return promise(browser.getElement('[name="q"]'));
    });
  });
  test('you can get an element', function () {
    return promise(browser.getElement('[name="q"]'));
  });
  test('you can test whether an element is visible', function () {
    return promise(browser.getElement('[name="q"]')).then(function (element) {
      return promise(element.isVisible());
    }).then(function (visible) {
      assert(visible === true);
    });
  });
  test('you can get an attribute of an element', function () {
    return promise(browser.getElement('[name="q"]')).then(function (element) {
      return promise(element.get('name'));
    }).then(function (name) {
      assert(name === 'q');
    });
  });
  test('you can type text into an element', function () {
    return promise(browser.getElement('[name="q"]')).then(function (element) {
      return promise(element.type('hello')).then(function () {
        return promise(element.type([' ', 'world']));
      }).then(function () {
        return promise(element.get('value'));
      }).then(function (value) {
        assert(value === 'hello world');
        return promise(element.clear());
      }).then(function () {
        return promise(element.get('value'));
      }).then(function (value) {
        assert(value === '');
      });
    });
  });
  test('you can get the text content of an element', function () {
    return promise(browser.getElement('[name="q"]')).then(function (element) {
      return promise(element.text()).then(function (text) {
        assert(typeof text === 'string');
      });
    });
  });
  test('it lets you dispose the browser', function () {
    return promise(browser.dispose({passed: true}));
  });
}

testBrowser(getBrowser({mode: 'sync', debug: true}), function (value) {
  assert(!value ||
         (typeof value !== 'object' && typeof value !== 'function') ||
         typeof value.then !== 'function');
  return Promise.from(value);
});
testBrowser(getBrowser({mode: 'async', debug: true}), function (value) {
  assert(value &&
         (typeof value === 'object' || typeof value === 'function') &&
         typeof value.then === 'function');
  return value;
});