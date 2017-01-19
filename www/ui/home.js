import React from 'react';
import Logo from './logo';
import Header from './styling/header';
import Heading from './styling/heading';
import Mode from './mode';
import CodeBlock from './documentation/code-block';

function SyncExample() {
  return javascript`
    import assert from 'assert';
    import cabbie from 'cabbie-sync';
    import chromedriver from 'chromedriver';

    chromedriver.start();
    let disposeDriver = () => {};
    try {
      const driver = cabbie('chromedriver', {debug: true});
      disposeDriver = () => driver.dispose();

      driver.browser.activeWindow.navigator.navigateTo('http://example.com');

      assert.equal(
        dirver.browser.activeWindow.getElement('h1').getText(),
        'Example Domain',
      );
    } finally {
      chromedriver.stop();
      disposeDriver();
    }
  `;
}
function AsyncExample() {
  return javascript`
    import assert from 'assert';
    import cabbie from 'cabbie-async';
    import chromedriver from 'chromedriver';

    chromedriver.start();
    let disposeDriver = () => Promise.resolve(null);
    async function runTest() {
      try {
        const driver = cabbie('chromedriver', {debug: true});
        disposeDriver = () => driver.dispose();

        await driver.browser.activeWindow.navigator.navigateTo('http://example.com');

        const heading = await dirver.browser.activeWindow.getElement('h1');
        assert.equal(
          await heading.getText(),
          'Example Domain',
        );
      } finally {
        chromedriver.stop();
        await disposeDriver();
      }
    }
  `;
}
function Home() {
  return (
    <div>
      <Header>
        <Logo width='10vw' height='10vw' />
        <Heading>Cabbie</Heading>
      </Header>
      <div style={{margin: 'auto', maxWidth: 1000}}>
        <Mode sync={<SyncExample />} async={<AsyncExample />} />
      </div>
    </div>
  );
}
export default Home;
