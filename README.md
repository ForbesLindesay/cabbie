# cabbie

A webdriver client

[![Build Status](https://img.shields.io/travis/ForbesLindesay/cabbie/master.svg)](https://travis-ci.org/ForbesLindesay/cabbie)
[![Selenium Test Status](https://saucelabs.com/buildstatus/cabbie)](https://saucelabs.com/u/cabbie)
[![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/cabbie.svg)](https://gemnasium.com/ForbesLindesay/cabbie)
[![NPM version](https://img.shields.io/npm/v/cabbie.svg)](http://badge.fury.io/js/cabbie)

## Installation

    npm install cabbie

## Usage

```js
var assert = require('assert');
var getBrowser = require('cabbie');
var chromedriver = require('chromedriver');

chromedriver.start();

var browser = getBrowser('http://localhost:9515/', {}, {mode: 'sync', debug: true});

browser.navigateTo('http://www.example.com');
assert(browser.getElement('h1').text() === 'Example Domain');

browser.dispose();

chromedriver.stop();
```

## License

  MIT