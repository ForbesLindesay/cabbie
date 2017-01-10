import type {Driver} from 'cabbie-async';

async function run(driver: Driver, location: string) {
  async function clickElement(elementSelector) {
    const element = await driver.browser.activeWindow.getElement(elementSelector);
    await element.mouse.click();
    return element;
  }
}
export default run;
