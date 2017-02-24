import assert from 'assert';
import cabbie, {startChromedriver} from 'cabbie-async';

// Start the chromedriver server, this provides a local selenium server
// You must install chromedriver to use this.
startChromedriver();

async function runTest() {
  // connect to chromedriver, adding {debug: true} makes cabbie log each method call.
  const driver = cabbie('chromedriver', {debug: true, capabilities: {browserName: 'chrome'}});

  try {
    await driver.browser.activeWindow.navigator.navigateTo('http://example.com');

    const heading = await driver.browser.activeWindow.getElement('h1');
    assert.equal(
      await heading.getText(),
      'Example Domain',
    );
  } finally {
    await driver.dispose();
  }
}

runTest().then(() => {
  console.log('tests passed');
  process.exit(0);
}, ex => {
  console.error(ex.stack);
  process.exit(1);
});
