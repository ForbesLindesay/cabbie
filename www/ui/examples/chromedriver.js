import React from 'react';
import Mode from '../mode';
import CodeBlock from '../documentation/code-block';

function SyncExample() {
  return javascript`
    import assert from 'assert';
    import cabbie, {startChromedriver} from 'cabbie-sync';

    // Start the chromedriver server, this provides a local selenium server
    // You must install chromedriver to use this.
    startChromedriver();

    // connect to chromedriver, adding {debug: true} makes cabbie log each method call.
    const driver = cabbie('chromedriver', {debug: true});

    try {
      // navigate to a url in the currently active window
      driver.activeWindow.navigateTo('http://example.com');

      // get an element, and check that its text equals some expected value
      assert.equal(
        driver.activeWindow.getElement('h1').getText(),
        'Example Domain',
      );
    } finally {
      // whether tests pass or fail, dispose of the driver
      driver.dispose();
    }
  `;
}
function AsyncExample() {
  return javascript`
    import assert from 'assert';
    import cabbie, {startChromedriver} from 'cabbie-async';

    // Start the chromedriver server, this provides a local selenium server
    // You must install chromedriver to use this.
    startChromedriver();

    async function runTest() {
      // connect to chromedriver, adding {debug: true} makes cabbie log each method call.
      const driver = cabbie('chromedriver', {debug: true});

      try {
        await driver.activeWindow.navigateTo('http://example.com');

        const heading = await driver.activeWindow.getElement('h1');
        assert.equal(
          await heading.getText(),
          'Example Domain',
        );
      } finally {
        await driver.dispose();
      }
    }

    runTest().catch(ex => {
      console.error(ex.stack);
      process.exit(1);
    });
  `;
}

export default () => <Mode sync={<SyncExample />} async={<AsyncExample />} />;
