// @flow

import assert from 'assert';
import cabbie, {startChromedriver} from 'cabbie-sync';

// Start the chromedriver server, this provides a local selenium server
// You must install chromedriver to use this.
if (!process.env.SAUCE_USERNAME) {
  startChromedriver();
}

// connect to chromedriver, adding {debug: true} makes cabbie log each method call.
const driver = cabbie(
  process.env.SAUCE_USERNAME ? 'saucelabs' : 'chromedriver',
  {debug: true, capabilities: {browserName: 'chrome'}},
);

try {
  // navigate to a url in the currently active window
  driver.browser.activeWindow.navigator.navigateTo('http://example.com');

  // get an element, and check that its text equals some expected value
  assert.equal(
    driver.browser.activeWindow.getElement('h1').getText(),
    'Example Domain',
  );
} finally {
  // whether tests pass or fail, dispose of the driver
  driver.dispose();
}
console.log('tests passed');
process.exit(0);
