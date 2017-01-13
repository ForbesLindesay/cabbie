# Cabbie

A synchronous and asynchronous webdriver client for node.js.  This client is completely standalone so you can use your choice of test framework: jest, mocha, jasmine, tap.......you decide!

## Installation

To get both:

```
npm install cabbie
```

If you only need one or the other:

```
npm install cabbie-async
npm install cabbie-sync
```

## Usage

```js
const cabbie = require('cabbie/async'); // or require('cabbie-async');
```

```js
const cabbie = require('cabbie/sync'); // or require('cabbie-sync');
```
