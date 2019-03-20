// @flow

import { Driver, getStatus, MouseButtons, SelectorTypes } from "cabbie-sync";
import chalk from 'chalk';
import assert from 'assert';

function test(name: string, fn: () => void) {
  console.log(chalk.blue(name));
  fn();
}

export default function run(driver: Driver, location: string) {
  test('test timeouts', () => {
    driver.timeOut.setTimeOuts({
      implicit: '1s',
      async: '10s'
    });
  });
  test('get the active window handle', () => {
    const activeWindowHandle = driver.activeWindow.getWindowHandle();
    assert.notEqual(activeWindowHandle.id, 'current');
    assert.equal(typeof activeWindowHandle.id, 'string');
  });
  test('navigate to a domain', () => {
    driver.activeWindow.navigateTo(location);
  });
  test('get the url of the active window', () => {
    assert.equal(driver.activeWindow.getUrl(), location);
  });
  test('select a single element', () => {
    const alertButton = driver.activeWindow.getElement('#alert_button');
    assert(alertButton && typeof alertButton === 'object');
  }); // this is very slow:
  // await test('selecting an element that does not exist throws an exception', async () => {
  //   try {
  //     await driver.activeWindow.getElement('#does_not_exist');
  //   } catch (ex) {
  //     assert.equal(ex.code, 'NoSuchElement');
  //     return;
  //   }
  //   assert(false, 'Expected getting a non-existent element to throw an error');
  // });

  test('selecting an element that does not exist throws an exception', () => {
    assert(null === driver.activeWindow.tryGetElement('#does_not_exist'), 'Expected getting a non-existent element to return null');
  });
  test("select a single element's id", () => {
    const alertButton = driver.activeWindow.getElement('#alert_button');
    const elementID = alertButton.elementID;
    assert(elementID.length > 0);
  });
  test('select a single element by name', () => {
    const element = driver.activeWindow.getElement('q', SelectorTypes.NAME);
    assert(element);
  });
  test('select a single element by id and check tag name', () => {
    const inputField = driver.activeWindow.getElement('inputField', SelectorTypes.ID);
    assert.equal(inputField.getTagName(), 'input');
  });
  test('get the computed css value of a single element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    assert.equal(areaToClick.getCssValue('width'), '500px');
  });
  test('check an element class existence', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    assert(inputField.hasClass('hasThisClass'));
    assert(inputField.hasClass('andAnotherClass'));
    assert(!inputField.hasClass('doesNotHaveClass'));
  });
  test('compare elements', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const confirmButton = driver.activeWindow.getElement('#confirm_button');
    assert(!inputField.isEqual(confirmButton));
    assert(!confirmButton.isEqual(inputField));
    const inputFieldByClass = driver.activeWindow.getElement('hasThisClass', SelectorTypes.CLASS);
    assert(inputField.isEqual(inputFieldByClass));
    assert(inputFieldByClass.isEqual(inputField));
  });
  test('check if an element is enabled', () => {
    const firstCheckBox = driver.activeWindow.getElement('#firstCheckBox');
    assert(firstCheckBox.isEnabled());
    assert(!firstCheckBox.isDisabled());
    const thirdCheckBox = driver.activeWindow.getElement('#thirdCheckBox');
    assert(!thirdCheckBox.isEnabled());
    assert(thirdCheckBox.isDisabled());
  });
  test('check if an item is selected', () => {
    const firstCheckBox = driver.activeWindow.getElement('#firstCheckBox');
    assert(firstCheckBox.isSelected());
    const secondCheckBox = driver.activeWindow.getElement('#secondCheckBox');
    assert(!secondCheckBox.isSelected());
  });
  test('submit a form', () => {
    const formToSubmit = driver.activeWindow.getElement('#formToSubmit');
    formToSubmit.submit();
    const url = driver.activeWindow.getUrl();
    assert.equal(url.substr(-7), '?q=1357');
  });
  test('click on an element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.click();
    assert.equal(areaToClick.getText(), 'clicked left at 450x75');
  });
  test('click on an element with right button', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.click(MouseButtons.RIGHT);
    assert.equal(areaToClick.getText(), 'clicked right');
  }); // N.B. we do not test middle click, because it causes the build to fail on a mac

  test('click on an element at a specific place', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.clickAt(14, 17);
    assert.equal(areaToClick.getText(), 'clicked left at 214x67');
  });
  test('double-click on an element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.doubleClick();
    assert.equal(areaToClick.getText(), 'double clicked left at 450x75');
  });
  test('double-click on an element at a specific place', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.doubleClickAt(14, 17);
    assert.equal(areaToClick.getText(), 'double clicked left at 214x67');
  });
  test('click down on an element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.buttonDownAt(13, 16);
    areaToClick.mouse.buttonUpAt(13, 16);
    assert.equal(areaToClick.getText(), 'clicked left at 213x66');
  });
  test('click up on an element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.buttonDownAt(88, 32);
    areaToClick.mouse.buttonUpAt(88, 32);
    assert.equal(areaToClick.getText(), 'clicked left at 288x82');
  });
  test('click down and up on an element', () => {
    const areaToClick = driver.activeWindow.getElement('#areaToClick');
    areaToClick.mouse.buttonDown();
    areaToClick.mouse.buttonUp();
    assert.equal(areaToClick.getText(), 'clicked left at 450x75');
  });
  test('get the size of an element', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const size = inputField.getSize();
    assert.equal(typeof size, 'object');
    assert(size.hasOwnProperty('width'));
    assert(size.hasOwnProperty('height'));
  });
  test('get the position of an element', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const position = inputField.getPosition();
    assert.equal(typeof position, 'object');
    assert(position.hasOwnProperty('x'));
    assert(position.hasOwnProperty('y'));
  });
  test('get the frame of an element', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const frame = inputField.getFrame();
    assert.equal(typeof frame, 'object');
    assert(frame.hasOwnProperty('x'));
    assert(frame.hasOwnProperty('y'));
    assert(frame.hasOwnProperty('width'));
    assert(frame.hasOwnProperty('height'));
  });
  test('get the absolute-center of an element', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const center = inputField.getAbsoluteCenter();
    assert.equal(typeof center, 'object');
    assert(center.hasOwnProperty('x'));
    assert(center.hasOwnProperty('y'));
  });
  test('get the relative-center of an element', () => {
    const inputField = driver.activeWindow.getElement('#inputField');
    const center = inputField.getRelativeCenter();
    assert.equal(typeof center, 'object');
    assert(center.hasOwnProperty('x'));
    assert(center.hasOwnProperty('y'));
  });
  test('select multiple elements', () => {
    const elements = driver.activeWindow.getElements('.class-selectable');
    assert.equal(elements.length, 2);
  });
  test('check if element exist', () => {
    assert(driver.activeWindow.hasElement('.class-selectable'));
    assert(!driver.activeWindow.hasElement('.class2-selectable'));
  });
  test('get a sub-element from a context', () => {
    const container = driver.activeWindow.getElement('#container');
    const subElement = container.getElement('#sub-element');
    assert.equal(subElement.getText(), 'Sub-Element');
    const subElement2 = container.getElement('.someSubElement');
    assert.equal(subElement2.getText(), 'Some Sub-Element');
  });
  test('get multiple sub-elements from a context', () => {
    const container = driver.activeWindow.getElement('#container');
    const subElements = container.getElements('div');
    assert(Array.isArray(subElements));
    assert.equal(subElements.length, 2);
  });
  test('check if sub-elements exist', () => {
    const container = driver.activeWindow.getElement('#container');
    assert(container.hasElement('.someSubElement'));
    assert(!container.hasElement('.somenNonExistentSubElement'));
  });
  test('get the active element', () => {
    const element = driver.activeWindow.getActiveElement();
    assert(element && typeof element === 'object');
  });
  test('get the title of the active window', () => {
    assert.equal(driver.activeWindow.getTitle(), 'Test Page');
  });
  test('get the source-code of the active window', () => {
    const source = driver.activeWindow.getSource();
    assert(source.includes('<!DOCTYPE html>'));
  });
  test('click on a link', () => {
    const linkToClick = driver.activeWindow.getElement('#linkToClick');
    linkToClick.mouse.click();
    assert.equal(driver.activeWindow.getTitle(), 'Linked Page');
  });
  test('send keys to the active window', () => {
    driver.activeWindow.sendKeys('a');
    const typeKeyPress = driver.activeWindow.getElement('#typeKeyPress');
    assert.equal(typeKeyPress.getText(), 'KeyPress:97');
    const typeKeyUp = driver.activeWindow.getElement('#typeKeyUp');
    assert.equal(typeKeyUp.getText(), 'KeyUp:65');
    driver.activeWindow.sendKeys(['a', 'b']);
    assert.equal(typeKeyPress.getText(), 'KeyPress:98');
    assert.equal(typeKeyUp.getText(), 'KeyUp:66');
    const typeKeyDown = driver.activeWindow.getElement('#typeKeyDown');
    assert.equal(typeKeyDown.getText(), 'KeyDown:66');
  });
  test('go backward', () => {
    driver.activeWindow.goBackward();
  });
  test('go forward', () => {
    driver.activeWindow.goForward();
    driver.activeWindow.goBackward();
  });
  test('refresh', () => {
    driver.activeWindow.refresh();
  });
  test('accept an alert', () => {
    const alertButton = driver.activeWindow.getElement('#alert_button');
    alertButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'This is a test alert!');
    driver.activeWindow.alert.accept();
    assert.equal(alertButton.getText(), 'alerted');
  });
  test('accept a confirm', () => {
    const confirmButton = driver.activeWindow.getElement('#confirm_button');
    confirmButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'Test confirmation');
    driver.activeWindow.alert.accept();
    assert.equal(confirmButton.getText(), 'confirmed');
  });
  test('dismiss a confirm', () => {
    const confirmButton = driver.activeWindow.getElement('#confirm_button');
    confirmButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'Test confirmation');
    driver.activeWindow.alert.dismiss();
    assert.equal(confirmButton.getText(), 'denied');
  });
  test('accept a prompt with default value', () => {
    const promptButton = driver.activeWindow.getElement('#prompt_button');
    promptButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'Test Prompt:');
    driver.activeWindow.alert.accept();
    assert.equal(promptButton.getText(), 'prompted: default value');
  });
  test('accept a prompt with custom value', () => {
    const promptButton = driver.activeWindow.getElement('#prompt_button');
    promptButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'Test Prompt:');
    driver.activeWindow.alert.setText('Works!');
    driver.activeWindow.alert.accept();
    assert.equal(promptButton.getText(), 'prompted: Works!');
  });
  test('dismiss a prompt', () => {
    const promptButton = driver.activeWindow.getElement('#prompt_button');
    promptButton.mouse.click();
    assert.equal(driver.activeWindow.alert.getText(), 'Test Prompt:');
    driver.activeWindow.alert.dismiss();
    assert.equal(promptButton.getText(), 'prompted: null');
  });
  test('execute javascript code as string', () => {
    driver.activeWindow.execute("alert('test-32');");
    assert.equal(driver.activeWindow.alert.getText(), 'test-32');
    driver.activeWindow.alert.accept();
  }); // This test does not play well with snapshots:
  // await test('execute javascript code as a function', async () => {
  //   await driver.activeWindow.execute(function() {
  //     alert('test-33');
  //   });
  //   assert.equal(await driver.activeWindow.alert.getText(), 'test-33');
  //   await driver.activeWindow.alert.accept();
  // });

  test('execute javascript code as a function with parameters', () => {
    const alertButtonText = driver.activeWindow.execute('return document.getElementById(arguments[0]).textContent;', ['alert_button']);
    assert.equal(alertButtonText, 'alerted');
  });
  test('execute asynchronous javascript code', () => {
    driver.activeWindow.asyncExecute("alert('test-35');");
    assert.equal(driver.activeWindow.alert.getText(), 'test-35');
    driver.activeWindow.alert.accept();
  });
  test('take a screenshot', () => {
    const buffer = driver.activeWindow.takeScreenshot();
    assert(buffer instanceof Buffer);
  });
  test('set a value in cookie-storage', () => {
    const cookie1 = {
      name: 'testKey',
      value: '2468'
    };
    const cookie2 = {
      name: 'testKeySecond',
      value: 'hello'
    };
    driver.cookieStorage.setCookie(cookie1);
    driver.cookieStorage.setCookie(cookie2);
  });
  test('get a value in cookie-storage', () => {
    const cookie = driver.cookieStorage.getCookie('testKey');

    if (!cookie) {
      throw new Error('Cookie should not be undefined');
    }

    assert.equal(cookie.name, 'testKey');
    assert.equal(cookie.value, '2468');
  });
  test('get the size of cookie-storage', () => {
    const size = driver.cookieStorage.getSize();
    assert(typeof size === 'number');
  });
  test('get all keys in cookie-storage', () => {
    const keys = driver.cookieStorage.getKeys();
    assert(keys.includes('testKey'));
    assert(keys.includes('testKeySecond'));
  });
  test('remove a key from cookie-storage', () => {
    driver.cookieStorage.removeCookie('testKey');
    const keys = driver.cookieStorage.getKeys();
    assert(!keys.includes('testKey'));
    assert(keys.includes('testKeySecond'));
  });
  test('get all cookies in cookie-storage', () => {
    const cookies = driver.cookieStorage.getCookies();
    assert(Array.isArray(cookies));
  });
  test('clear the cookie-storage', () => {
    driver.cookieStorage.clear();
    assert.equal(driver.cookieStorage.getSize(), 0);
  });
  test('set a value in local-storage', () => {
    driver.localStorage.setItem('testKey', '2468');
    driver.localStorage.setItem('testKeySecond', 'hello');
  });
  test('get a value in local-storage', () => {
    assert.equal(driver.localStorage.getItem('testKey'), '2468');
  });
  test('get the size of local-storage', () => {
    assert.equal(driver.localStorage.getSize(), 2);
  });
  test('get all keys in local-storage', () => {
    assert.deepEqual(driver.localStorage.getKeys(), ['testKey', 'testKeySecond']);
  });
  test('remove a key from local-storage', () => {
    driver.localStorage.removeItem('testKey');
    assert.equal(driver.localStorage.getSize(), 1);
    assert.deepEqual(driver.localStorage.getKeys(), ['testKeySecond']);
  });
  test('clear the local-storage', () => {
    driver.localStorage.clear();
    assert.equal(driver.localStorage.getSize(), 0);
  });
  test('set a value in session-storage', () => {
    driver.sessionStorage.setItem('testKey', '2468');
    driver.sessionStorage.setItem('testKeySecond', 'hello');
  });
  test('get a value in session-storage', () => {
    assert.equal(driver.sessionStorage.getItem('testKey'), '2468');
  });
  test('get the size of session-storage', () => {
    assert.equal(driver.sessionStorage.getSize(), 2);
  });
  test('get all keys in session-storage', () => {
    assert.deepEqual(driver.sessionStorage.getKeys(), ['testKey', 'testKeySecond']);
  });
  test('remove a key from session-storage', () => {
    driver.sessionStorage.removeItem('testKey');
    assert.equal(driver.sessionStorage.getSize(), 1);
    assert.deepEqual(driver.sessionStorage.getKeys(), ['testKeySecond']);
  });
  test('clear the session-storage', () => {
    driver.sessionStorage.clear();
    assert.equal(driver.sessionStorage.getSize(), 0);
  });
  test('get the text of an element', () => {
    const element = driver.activeWindow.getElement('q', SelectorTypes.NAME);
    assert.equal(element.getAttribute('value'), '1357');
  });
  test('clear the text of an input element', () => {
    const element = driver.activeWindow.getElement('[name="q"]');
    element.clear();
    assert.equal(element.getAttribute('value'), '');
  });
  test('write text into an input element', () => {
    const element = driver.activeWindow.getElement('q', SelectorTypes.NAME);
    element.sendKeys('test-45');
    assert.equal(element.getAttribute('value'), 'test-45');
  });
  test('get a server status', () => {
    const status = getStatus(driver.remote, driver.options); // Not required, but still execute and see if fails

    status.getBuildVersion();
    status.getBuildRevision();
    status.getBuildTime(); // Sauce labs doesn't support these so we return undefined

    status.getOSVersion();
    status.getOSArchitecture();
    status.getOSName();
  }); // TODO: this feature is not supported by sauce labs:
  // test("get a session list", async () => {
  //   const sessions = await getSessions(driver.remote, driver.options);
  //   console.log(sessions);
  // });

  test('get capabilities information', () => {
    const session = driver.session;
    console.dir(session.capabilities);
  });
  test('get an element', () => {
    const element = driver.activeWindow.getElement('h1');
    assert.notStrictEqual(element, null);
  });
  test('test whether an element is displayed', () => {
    const element = driver.activeWindow.getElement('h1');
    assert(element.isDisplayed());
    const hiddenElement = driver.activeWindow.getElement('#hidden');
    assert(!hiddenElement.isDisplayed());
  });
  test('get an attribute of an element', () => {
    const element = driver.activeWindow.getElement('#has-attribute');
    assert.equal(element.getAttribute('data-attribute'), 'value');
  });
  test('type text into an element', () => {
    const element = driver.activeWindow.getElement('[name="q"]');
    element.clear();
    element.sendKeys('hello');
    element.sendKeys([' ', 'world']);
    assert.equal(element.getAttribute('value'), 'hello world');
    element.clear();
    assert.equal(element.getAttribute('value'), '');
  });
  test('get the text content of an element', () => {
    const element = driver.activeWindow.getElement('#has-text');
    assert.equal(element.getText(), 'test content');
  });
  test('click on a button', () => {
    const button = driver.activeWindow.getElement('#clickable');
    button.mouse.click();
    assert.equal(button.getText(), 'clicked');
  });
  test('get the position of the active window', () => {
    const position = driver.activeWindow.getPosition();
    assert.equal(typeof position, 'object');
    assert.equal(typeof position.x, 'number');
    assert.equal(typeof position.y, 'number');
  });
  test('get the size of the active window', () => {
    const size = driver.activeWindow.getSize();
    assert.equal(typeof size, 'object');
    assert.equal(typeof size.width, 'number');
    assert.equal(typeof size.height, 'number');
  });
  test('resize the active window', () => {
    driver.activeWindow.resize(500, 300);
    assert.deepEqual(driver.activeWindow.getSize(), {
      width: 500,
      height: 300
    });
  });
  test('position the active window', () => {
    driver.activeWindow.position(160, 163);
    assert.deepEqual(driver.activeWindow.getPosition(), {
      x: 160,
      y: 163
    });
  });
  test('maximize the active window', () => {
    driver.activeWindow.maximize();
  });
  test('close the active window', () => {
    driver.activeWindow.close();
  });
} // TODO: sauce job info
// TODO: test touch interface