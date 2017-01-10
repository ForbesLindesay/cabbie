// @flow

import type {Driver} from 'cabbie-async';
import assert from 'assert';

async function run(driver: Driver, location: string) {
  async function clickElement(elementSelector: string) {
    const element = await driver.browser.activeWindow.getElement(elementSelector);
    await element.mouse.click();
    return element;
  }
  async function checkText(elementSelector: string, expectedText: string) {
    const element = await driver.browser.activeWindow.getElement(elementSelector);
    const actualText = await element.getText();
    assert.equal(actualText, expectedText);
    return element;
  }

  console.log('test timeouts');

  driver.timeOut.setTimeOuts({
    'implicit': '1s',
    'async': '10s',
  });

}

export default run;
