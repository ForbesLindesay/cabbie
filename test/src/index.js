import fs from 'fs';
import assert from 'assert';
import test from 'testit';
import request from 'sync-request';
import createCabbie from 'cabbie-async';
import chromedriver from 'chromedriver';
import runTest from './run-test';

if (process.argv.indexOf('--help') !== -1 || process.argv.indexOf('-h') !== -1) {
  console.log('node test [options]');
  console.log('');
  console.log('  -h --help  This help text');
  console.log('  -s --sauce Run tests in sauce labs');
  console.log('             (default if CI env variable is present)');
  console.log('  -l --local Run tests locally (default)');
  process.exit(0);
}

const LOCAL_FLAG = (process.argv.indexOf('--local') !== -1 ||
                    process.argv.indexOf('-l') !== -1);
const SAUCE_FLAG = (process.argv.indexOf('--sauce') !== -1 ||
                    process.argv.indexOf('-s') !== -1);

if (LOCAL_FLAG && SAUCE_FLAG) {
  console.error('You cannot use sauce and local in one test run.');
  console.error('Run node test --help for help');
  process.exit(1);
}

const LOCAL = LOCAL_FLAG || (!process.env.CI && !SAUCE_FLAG);

function doReplacements(source: string, replacements: {[key: string]: string}): string {
  Object.keys(replacements).forEach(function (key) {
    source = source.split(key).join(replacements[key]);
  });
  return source;
}

function createPage(filename: string, replacements?: {[key: string]: string}): string {
  var html = fs.readFileSync(filename, 'utf8');
  if (replacements) {
    html = doReplacements(html, replacements);
  }
  const res = request('POST', 'https://tempjs.org/create', {
    json: { html: html }
  }).getBody('utf8');
  const parsed = JSON.parse(res);
  return 'https://tempjs.org' + parsed.path;
}

async function run() {
  if (LOCAL) {
    console.log('starting chromedriver');
    chromedriver.start();
  }
  const remote = (
    LOCAL
    ? 'http://localhost:9515/'
    : 'http://cabbie:6f1108e1-6b52-47e4-b686-95fa9eef2156@ondemand.saucelabs.com/wd/hub'
  );
  const options = (
    LOCAL
    ? {}
    : {browserName: 'chrome'}
  );
  let driver;
  try {
    console.log('creating driver');
    driver = createCabbie(remote, options);
    const location = createPage(__dirname + '/../demoPage.html', {
      '{{linked-page}}': createPage(__dirname + '/../linkedTo.html'),
    });
    await runTest(driver, location);
  } finally {
    if (driver) {
      await driver.dispose();
    }
    chromedriver.stop();
  }
}
(async () => {
  try {
    await run();
  } catch (ex) {
    console.error(ex.stack || ex.message || ex);
    process.exit(1);
  }
})();
// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, require('ms')(time + ''));
//   });
// }
//
// function clickElement(driver, promise, elementSelector) {
//   return promise(driver.browser().activeWindow().getElement(elementSelector)).then(function (element) {
//     return promise(element.mouse().click()).then(function () {
//       return element;
//     });
//   });
// }
//
// function checkText(driver, promise, elementSelector, expectedText) {
//   return promise(driver.browser().activeWindow().getElement(elementSelector)).then(function (element) {
//     return promise(element.getText()).then(function (actualText) {
//       assert.equal(actualText, expectedText);
//       return element;
//     });
//   });
// }
//
//
// test('throws an error if you try and get a driver with an invalid mode', function () {
//   try {
//     var driver = getDriver({mode: 'foo'});
//   } catch (ex) {
//     assert(ex instanceof Error);
//   }
// });
//
// function testBrowser(name, getDriver, promise) {
//   var driver;
//   test('init driver', function () {
//     console.log('');
//     console.log('begin ' + name + ' tests');
//     console.log('');
//     driver = getDriver();
//   });
//   test('specify a sauce job name', function () {
//     return promise(driver
//                    .sauceJobUpdate({
//                      name: name,
//                      build: process.env.TRAVIS_JOB_ID
//                    }));
//   });
//
//   test('set timeouts', function () {
//     return promise(driver.timeOut().setTimeOuts({
//       'implicit': '1s',
//       'async': '10s'
//     }));
//   });
//
//
//   test('get the active window', function () {
//     assert(driver.browser().activeWindow() instanceof cabbie.ActiveWindow);
//   });
//
//   test('get the active window id as current', function () {
//     assert.equal(driver.browser().activeWindow().id(), "current");
//   });
//
//   test('get the active window id as current', function () {
//     return promise(driver.browser().activeWindow().getId()).then(function (id) {
//       assert.notEqual(id, "current");
//       assert.equal(typeof id, "string");
//     });
//   });
//
//
//   test('get the position of the active window', function () {
//     return promise(driver.browser().activeWindow().getPosition()).then(function (position) {
//       assert.equal(typeof position, "object");
//       assert(position.hasOwnProperty("x"));
//       assert(position.hasOwnProperty("y"));
//     });
//   });
//
//   test('get the size of the active window', function () {
//     return promise(driver.browser().activeWindow().getSize()).then(function (size) {
//       assert.equal(typeof size, "object");
//       assert(size.hasOwnProperty("width"));
//       assert(size.hasOwnProperty("height"));
//     });
//   });
//
//   test('resize the active window', function () {
//     return promise(driver.browser().activeWindow().resize(500, 300)).then(function () {
//       return promise(driver.browser().activeWindow().getSize()).then(function (size) {
//         assert.equal(size.width, 500);
//         assert.equal(size.height, 300);
//       });
//     });
//   });
//
//   test('position the active window', function () {
//     return promise(driver.browser().activeWindow().position(160, 163)).then(function () {
//       return promise(driver.browser().activeWindow().getPosition()).then(function (position) {
//         assert.equal(position.x, 160);
//         assert.equal(position.y, 163);
//       });
//     });
//   });
//
//   test('activate the already active window', function () {
//     return promise(driver.browser().activeWindow().activate());
//   });
//
//   test('maximize the active window', function () {
//     return promise(driver.browser().activeWindow().maximize());
//   });
//
//
//   test('navigate to a domain', function () {
//     return location.then(function (location) {
//       return promise(driver.browser().activeWindow().navigator().navigateTo(location));
//     });
//   });
//
//   test('get the url of the active window', function () {
//     return location.then(function (location) {
//       return promise(driver.browser().activeWindow().navigator().getUrl())
//       .then(function (url) {
//         assert.equal(url, location);
//       });
//     });
//   });
//
//
//
//   test('select a single element', function () {
//     return promise(driver.browser().activeWindow().getElement('#alert_button')).then(function (element) {
//       assert(element instanceof cabbie.Element);
//     });
//   });
//
//   test('select a single element handler', function () {
//     return promise(driver.browser().activeWindow().getElement('#alert_button')).then(function (element) {
//       assert.equal(typeof element.elementHandler(), "object");
//     });
//   });
//
//   test('select a single element id', function () {
//     return promise(driver.browser().activeWindow().getElement('#alert_button')).then(function (element) {
//       assert(element.elementId().length > 0);
//     });
//   });
//
//   test('select a single element by name', function () {
//     return promise(driver.browser().activeWindow().getElement('q', cabbie.Element.SELECTOR_NAME)).then(function (element) {
//       assert(element instanceof cabbie.Element);
//     });
//   });
//
//   test('select a single element by id and check name', function () {
//     return promise(driver.browser().activeWindow().getElement('inputField', cabbie.Element.SELECTOR_ID)).then(function (element) {
//       return promise(element.getTagName());
//     }).then(function (name) {
//       assert.equal(name, "input");
//     });
//   });
//
//   test('get the computer css value of a single element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.getCssValue("width"));
//     }).then(function (value) {
//       assert.equal(value, "500px");
//     });
//   });
//
//   test('check an element class existence', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.hasClass("hasThisClass")).then(function (exists) {
//         assert(exists);
//         return promise(element.hasClass("andAnotherClass"));
//       }).then(function (exists) {
//         assert(exists);
//         return promise(element.hasClass("doesnotHaveClass"));
//       }).then(function (exists) {
//         assert(!exists);
//       });
//     });
//   });
//
//   test('compare elements', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element1) {
//       return promise(driver.browser().activeWindow().getElement('#confirm_button')).then(function (element2) {
//         return promise(element1.isEqual(element2)).then(function (isEqual) {
//           assert(!isEqual);
//           return promise(element2.isEqual(element1));
//         });
//       }).then(function (isEqual) {
//         assert(!isEqual);
//
//         return promise(driver.browser().activeWindow().getElement('hasThisClass', cabbie.Element.SELECTOR_CLASS));
//       }).then(function (element2) {
//         return promise(element1.isEqual(element2)).then(function (isEqual) {
//           assert(isEqual);
//           return promise(element2.isEqual(element1));
//         });
//       }).then(function (isEqual) {
//         assert(isEqual);
//       });
//     });
//   });
//
//
//
//
//   test('check if an item is disabled', function () {
//     return promise(driver.browser().activeWindow().getElement('#firstCheckBox')).then(function (element) {
//       return promise(element.isEnabled()).then(function (enabled) {
//         assert(enabled);
//         return promise(element.isDisabled())
//       }).then(function (disabled) {
//         assert(!disabled);
//         return promise(driver.browser().activeWindow().getElement('#thirdCheckBox'));
//       });
//     }).then(function (element) {
//       return promise(element.isEnabled()).then(function (enabled) {
//         assert(!enabled);
//         return promise(element.isDisabled())
//       }).then(function (disabled) {
//         assert(disabled);
//       });
//     });
//   });
//
//   test('check if an item is selected', function () {
//     return promise(driver.browser().activeWindow().getElement('#firstCheckBox')).then(function (element) {
//       return promise(element.isSelected()).then(function (selected) {
//         assert(selected);
//         return promise(driver.browser().activeWindow().getElement('#secondCheckBox'));
//       });
//     }).then(function (element) {
//       return promise(element.isSelected()).then(function (selected) {
//         assert(!selected);
//       });
//     });
//   });
//
//   test('submit a form', function () {
//     return promise(driver.browser().activeWindow().getElement('#formToSubmit')).then(function (form) {
//       return promise(form.submit());
//     }).then(function () {
//       return promise(driver.browser().activeWindow().navigator().getUrl());
//     }).then(function (url) {
//       assert.equal(url.substr(-7), '?q=1357');
//     });
//   });
//
//   test('get a touch object on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#firstCheckBox')).then(function (element) {
//       assert(element.touch() instanceof cabbie.Touch);
//     });
//   });
//
//   test('get a mouse object on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#firstCheckBox')).then(function (element) {
//       assert(element.mouse() instanceof cabbie.Mouse);
//     });
//   });
//
//   test('click on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().click()).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked left at 450x75');
//       });
//     });
//   });
//
//   test('click on an element with left button', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().click()).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked left at 450x75');
//       });
//     });
//   });
//
//   test('click on an element with right button', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().click(cabbie.Mouse.BUTTON_RIGHT)).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked right');
//       });
//     });
//   });
//
//   /*
//   test('click on an element at a specific place', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().clickAt(14, 17, cabbie.Mouse.BUTTON_MIDDLE)).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked middle at 214x67');
//       });
//     });
//   });
//
//   test('click on an element with middle button', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().click(cabbie.Mouse.BUTTON_MIDDLE)).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked middle at 450x75');
//       });
//     });
//   });
//   */
//
//   test('double-click on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().doubleClick()).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'double clicked left at 450x75');
//       });
//     });
//   });
//
//   test('double-click on an element at a specific place', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().doubleClickAt(14, 17)).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'double clicked left at 214x67');
//       });
//     });
//   });
//
//   test('click down on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().buttonDownAt(13, 16)).then(function () {
//         return promise(element.mouse().buttonUpAt(13, 16));
//       }).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked left at 213x66');
//       });
//     });
//   });
//
//   test('click up on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().buttonDownAt(88, 32)).then(function () {
//         return promise(element.mouse().buttonUpAt(88, 32));
//       }).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked left at 288x82');
//       });
//     });
//   });
//
//   test('click down and up on an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#areaToClick')).then(function (element) {
//       return promise(element.mouse().buttonDown()).then(function () {
//         return promise(element.mouse().buttonUp());
//       }).then(function () {
//         return promise(element.getText());
//       }).then(function (text) {
//         assert.equal(text, 'clicked left at 450x75');
//       });
//     });
//   });
//
//
//
//
//
//
//
//   test('get the size of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.getSize()).then(function (size) {
//         assert.equal(typeof size, "object");
//         assert(size.hasOwnProperty("width"));
//         assert(size.hasOwnProperty("height"));
//       });
//     });
//   });
//
//   test('get the position of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.getPosition()).then(function (position) {
//         assert.equal(typeof position, "object");
//         assert(position.hasOwnProperty("x"));
//         assert(position.hasOwnProperty("y"));
//       });
//     });
//   });
//
//   test('get the frame of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.getFrame()).then(function (position) {
//         assert.equal(typeof position, "object");
//         assert(position.hasOwnProperty("x"));
//         assert(position.hasOwnProperty("y"));
//         assert(position.hasOwnProperty("width"));
//         assert(position.hasOwnProperty("height"));
//       });
//     });
//   });
//
//   test('get the absolute-center of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.getAbsoluteCenter()).then(function (position) {
//         assert.equal(typeof position, "object");
//         assert(position.hasOwnProperty("x"));
//         assert(position.hasOwnProperty("y"));
//       });
//     });
//   });
//
//   test('get the relative-center of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#inputField')).then(function (element) {
//       return promise(element.getRelativeCenter()).then(function (position) {
//         assert.equal(typeof position, "object");
//         assert(position.hasOwnProperty("x"));
//         assert(position.hasOwnProperty("y"));
//       });
//     });
//   });
//
//   test('select multiple elements', function () {
//     return promise(driver.browser().activeWindow().getElements('.class-selectable')).then(function (elements) {
//       assert.equal(elements.length, 2);
//       assert(elements[0] instanceof cabbie.Element);
//       assert(elements[1] instanceof cabbie.Element);
//     });
//   });
//
//   test('check if element exist', function () {
//     return promise(driver.browser().activeWindow().hasElement('.class-selectable')).then(function (result) {
//       assert(result);
//       return promise(driver.browser().activeWindow().hasElement('.class2-selectable')).then(function (result) {
//         assert(!result);
//       });
//     });
//   });
//
//
//   test('get a sub-element from a context', function () {
//     return promise(driver.browser().activeWindow().getElement('#container')).then(function (parentElement) {
//       return promise(parentElement.getElement("#sub-element")).then(function (subElement) {
//         return promise(subElement.getText()).then(function (text) {
//           assert.equal(text, "Sub-Element");
//         });
//       }).then(function () {
//         return promise(parentElement.getElement(".someSubElement")).then(function (subElement) {
//           return promise(subElement.getText()).then(function (text) {
//             assert.equal(text, "Some Sub-Element");
//           });
//         });
//       });
//     });
//   });
//
//   test('get multiple sub-elements from a context', function () {
//     return promise(driver.browser().activeWindow().getElement('#container')).then(function (parentElement) {
//       return promise(parentElement.getElements("div")).then(function (subElements) {
//         assert.equal(subElements.length, 2);
//         assert(subElements[0] instanceof cabbie.Element);
//         assert(subElements[1] instanceof cabbie.Element);
//       });
//     });
//   });
//
//   test('get multiple sub-elements from a context', function () {
//     return promise(driver.browser().activeWindow().getElement('#container')).then(function (parentElement) {
//       return promise(parentElement.hasElement(".someSubElement")).then(function (exists) {
//         assert(exists);
//         return promise(parentElement.hasElement(".somenNonExistentSubElement"));
//       }).then(function (exists) {
//         assert(!exists);
//       });
//     });
//   });
//
//
//   test('get the active element', function () {
//     return promise(driver.browser().activeWindow().getActiveElement()).then(function (element) {
//       assert(element instanceof cabbie.Element);
//     });
//   });
//
//
//
//   test('get the title of the active window', function () {
//     return promise(driver.browser().activeWindow().getTitle()).then(function (title) {
//       assert.equal("Test Page", title);
//     });
//   });
//
//   test('get the source-code of the active window', function () {
//     return promise(driver.browser().activeWindow().getSource()).then(function (source) {
//       assert(source.length > 0);
//     });
//   });
//
//
//   test('click on a link', function () {
//     return promise(driver.browser().activeWindow().getElement('#linkToClick')).then(function (element) {
//       return promise(element.mouse().click());
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getTitle());
//     }).then(function (title) {
//       assert.equal(title, "Linked Page");
//     });
//   });
//
//   test('send keys to the active window', function () {
//     return promise(driver.browser().activeWindow().sendKeys('a')).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyPress'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyPress:97', text);
//       });
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyUp'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyUp:65', text);
//       });
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyDown'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyDown:65', text);
//       });
//
//     }).then(function () {
//       return promise(driver.browser().activeWindow().sendKeys(['a', 'b']));
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyPress'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyPress:98', text);
//       });
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyUp'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyUp:66', text);
//       });
//     }).then(function () {
//       return promise(driver.browser().activeWindow().getElement('#typeKeyDown'));
//     }).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert.equal('KeyDown:66', text);
//       });
//     });
//   });
//
//   test("go backward", function () {
//     return promise(driver.browser().activeWindow().navigator().backward());
//   });
//
//   test("go forward", function () {
//     return promise(driver.browser().activeWindow().navigator().forward()).then(function () {
//       return promise(driver.browser().activeWindow().navigator().backward());
//     });
//   });
//
//   test("refresh", function () {
//     return promise(driver.browser().activeWindow().navigator().refresh());
//   });
//
//
//   test("accept an alert", function () {
//     return clickElement(driver, promise, '#alert_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal(text, "This is a test alert!");
//     }).then(function () {
//       return promise(driver.browser().activeWindow().alert().accept());
//     }).then(function () {
//       return checkText(driver, promise, '#alert_button', "alerted");
//     });
//   });
//
//   test("accept a confirm", function () {
//     return clickElement(driver, promise, '#confirm_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal(text, "Test confirmation");
//     }).then(function () {
//       return promise(driver.browser().activeWindow().alert().accept());
//     }).then(function () {
//       return checkText(driver, promise, '#confirm_button', "confirmed");
//     });
//   });
//
//   test("dismiss a confirm", function () {
//     return clickElement(driver, promise, '#confirm_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().dismiss());
//     }).then(function () {
//       return checkText(driver, promise, '#confirm_button', "denied");
//     });
//   });
//
//   test("accept a prompt with default value", function () {
//     return clickElement(driver, promise, '#prompt_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal(text, "Test Prompt:");
//     }).then(function () {
//       return promise(driver.browser().activeWindow().alert().accept());
//     }).then(function () {
//       return checkText(driver, promise, '#prompt_button', "prompted: default value");
//     });
//   });
//
//   test("accept a prompt with custom value", function () {
//     return clickElement(driver, promise, '#prompt_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().setText('Works!'));
//     }).then(function () {
//       return promise(driver.browser().activeWindow().alert().accept());
//     }).then(function () {
//       return checkText(driver, promise, '#prompt_button', "prompted: Works!");
//     });
//   });
//
//   test("dismiss a prompt", function () {
//     return clickElement(driver, promise, '#prompt_button').then(function () {
//       return promise(driver.browser().activeWindow().alert().dismiss());
//     }).then(function () {
//       return checkText(driver, promise, '#prompt_button', "prompted: null");
//     });
//   });
//
//
//
//   test('execute javascript code as string', function () {
//     return promise(driver.browser().activeWindow().execute("alert('test-32');")).then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal('test-32', text);
//       return promise(driver.browser().activeWindow().alert().accept());
//     });
//   });
//
//
//   test('execute javascript code as a function', function () {
//     return promise(driver.browser().activeWindow().execute(function () { alert("test-33"); })).then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal('test-33', text);
//       return promise(driver.browser().activeWindow().alert().accept());
//     });
//   });
//
//   test('execute javascript code as a function with parameters', function () {
//     return promise(driver.browser().activeWindow().execute(function (value) { alert("test-" + value); }, [34])).then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal('test-34', text);
//       return promise(driver.browser().activeWindow().alert().accept());
//     });
//   });
//
//   test('execute asynchronous javascript code', function () {
//     return promise(driver.browser().activeWindow().asyncExecute("alert('test-35');")).then(function () {
//       return promise(driver.browser().activeWindow().alert().getText());
//     }).then(function (text) {
//       assert.equal('test-35', text);
//       return promise(driver.browser().activeWindow().alert().accept());
//     });
//   });
//
//
//   test('take a screenshot', function () {
//     return promise(driver.browser().activeWindow().takeScreenshot()).then(function (buffer) {
//       assert(buffer instanceof Buffer);
//     });
//   });
//
//
//   test('get the global touch object', function () {
//     assert(driver.browser().activeWindow().touch() instanceof cabbie.GlobalTouch);
//   });
//   test('get the global mouse object', function () {
//     assert(driver.browser().activeWindow().mouse() instanceof cabbie.GlobalMouse);
//   });
//   test('get the global navigator object', function () {
//     assert(driver.browser().activeWindow().navigator() instanceof cabbie.Navigator);
//   });
//   test('get the global frame object', function () {
//     assert(driver.browser().activeWindow().frame() instanceof cabbie.Frame);
//   });
//
//
//   test('get the global cookie-storage object', function () {
//     assert(driver.browser().cookieStorage() instanceof cabbie.CookieStorage);
//   });
//   test('create a cookie object', function () {
//     var cookie = new cabbie.Cookie();
//
//     cookie.setName("testKey");
//     cookie.setValue("2468");
//
//     assert.equal(cookie.getName(), "testKey");
//     assert.equal(cookie.getValue(), "2468");
//
//     assert.equal(cookie.getDomain(), undefined);
//     cookie.setDomain("www.google.com");
//     assert.equal(cookie.getDomain(), "www.google.com");
//
//     assert.equal(cookie.getPath(), "/");
//     cookie.setPath("/test");
//     assert.equal(cookie.getPath(), "/test");
//
//     assert.equal(cookie.isSecure(), undefined);
//     cookie.setSecure(true);
//     assert.equal(cookie.isSecure(), true);
//
//     assert.equal(cookie.isHttpOnly(), undefined);
//     cookie.setHttpOnly(false);
//     assert.equal(cookie.isHttpOnly(), false);
//
//     assert.equal(cookie.getExpiry(), undefined);
//     cookie.setExpiry(500);
//     assert.equal(cookie.getExpiry(), 500);
//
//     assert.deepEqual(cookie.toObject(), {"path":"/test","name":"testKey","value":"2468","domain":"www.google.com","secure":true,"httpOnly":false,"expiry":500});
//   });
//   test('set a value in cookie-storage', function () {
//     var cookie1 = new cabbie.Cookie(),
//         cookie2 = new cabbie.Cookie();
//
//     cookie1.setName("testKey");
//     cookie1.setValue("2468");
//
//     cookie2.setName("testKeySecond");
//     cookie2.setValue("hello");
//
//     return promise(driver.browser().cookieStorage().setCookie(cookie1)).then(function () {
//       return promise(driver.browser().cookieStorage().setCookie(cookie2))
//     });
//   });
//   test('get a value in cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().getCookie("testKey")).then(function (cookie) {
//       assert(cookie instanceof cabbie.Cookie);
//       assert.equal(cookie.getName(), "testKey");
//       assert.equal(cookie.getValue(), "2468");
//     });
//   });
//   test('get the size of cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().getSize()).then(function (size) {
//       assert(typeof size === 'number');
//     });
//   });
//   test('get all keys in cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().getKeys()).then(function (keys) {
//       assert(keys.indexOf('testKey') !== -1);
//       assert(keys.indexOf('testKeySecond') !== -1);
//     });
//   });
//   test('remove a key from cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().removeCookie("testKey")).then(function () {
//       return promise(driver.browser().cookieStorage().getKeys())
//     }).then(function (keys) {
//       assert(keys.indexOf('testKey') === -1);
//       assert(keys.indexOf('testKeySecond') !== -1);
//     });
//   });
//   test('get all cookies in cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().getCookies()).then(function (cookies) {
//       assert(cookies[0] instanceof cabbie.Cookie);
//     });
//   });
//   test('clear the cookie-storage', function () {
//     return promise(driver.browser().cookieStorage().clear()).then(function () {
//       return promise(driver.browser().cookieStorage().getSize());
//     }).then(function (size) {
//       assert.equal(size, 0);
//     });
//   });
//
//   test('get the global local-storage object', function () {
//     assert(driver.browser().localStorage() instanceof cabbie.LocalStorage);
//   });
//   test('set a value in local-storage', function () {
//     return promise(driver.browser().localStorage().setItem("testKey", "2468")).then(function () {
//       return promise(driver.browser().localStorage().setItem("testKeySecond", "hello"))
//     });
//   });
//   test('get a value in local-storage', function () {
//     return promise(driver.browser().localStorage().getItem("testKey")).then(function (value) {
//       assert.equal(value, "2468");
//     });
//   });
//   test('get the size of local-storage', function () {
//     return promise(driver.browser().localStorage().getSize()).then(function (size) {
//       assert.equal(size, 2);
//     });
//   });
//   test('get all keys in local-storage', function () {
//     return promise(driver.browser().localStorage().getKeys()).then(function (keys) {
//       assert.deepEqual(keys, ["testKey", "testKeySecond"]);
//     });
//   });
//   test('remove a key from local-storage', function () {
//     return promise(driver.browser().localStorage().removeItem("testKey")).then(function () {
//       return promise(driver.browser().localStorage().getSize());
//     }).then(function (size) {
//       assert.equal(size, 1);
//       return promise(driver.browser().localStorage().getKeys());
//     }).then(function (keys) {
//       assert.deepEqual(keys, ["testKeySecond"]);
//     });
//   });
//   test('clear the local-storage', function () {
//     return promise(driver.browser().localStorage().clear()).then(function () {
//       return promise(driver.browser().localStorage().getSize());
//     }).then(function (size) {
//       assert.equal(size, 0);
//     });
//   });
//
//
//   test('get the global session-storage object', function () {
//     assert(driver.sessionStorage() instanceof cabbie.SessionStorage);
//   });
//   test('set a value in session-storage', function () {
//     return promise(driver.sessionStorage().setItem("testKey", "2468")).then(function () {
//       return promise(driver.sessionStorage().setItem("testKeySecond", "hello"))
//     });
//   });
//   test('get a value in session-storage', function () {
//     return promise(driver.sessionStorage().getItem("testKey")).then(function (value) {
//       assert.equal(value, "2468");
//     });
//   });
//   test('get the size of session-storage', function () {
//     return promise(driver.sessionStorage().getSize()).then(function (size) {
//       assert.equal(size, 2);
//     });
//   });
//   test('get all keys in session-storage', function () {
//     return promise(driver.sessionStorage().getKeys()).then(function (keys) {
//       assert.deepEqual(keys, ["testKey", "testKeySecond"]);
//     });
//   });
//   test('remove a key from session-storage', function () {
//     return promise(driver.sessionStorage().removeItem("testKey")).then(function () {
//       return promise(driver.sessionStorage().getSize());
//     }).then(function (size) {
//       assert.equal(size, 1);
//       return promise(driver.sessionStorage().getKeys());
//     }).then(function (keys) {
//       assert.deepEqual(keys, ["testKeySecond"]);
//     });
//   });
//   test('clear the session-storage', function () {
//     return promise(driver.sessionStorage().clear()).then(function () {
//       return promise(driver.sessionStorage().getSize());
//     }).then(function (size) {
//       assert.equal(size, 0);
//     });
//   });
//
//
//   test('get the IME object', function () {
//     assert(driver.browser().ime() instanceof cabbie.IME);
//   });
//
//
//   test('get the text of an element', function () {
//     return promise(driver.browser().activeWindow().getElement("q", cabbie.Element.SELECTOR_NAME)).then(function (element) {
//       return promise(element.getAttribute('value'));
//     }).then(function (text) {
//       assert.equal(text, '1357');
//     });
//   });
//
//   test('clear the text of an input element', function () {
//     return promise(driver.browser().activeWindow().getElement("q", cabbie.Element.SELECTOR_NAME)).then(function (element) {
//       return promise(element.clear()).then(function () {
//         return promise(element.getAttribute('value'));
//       }).then(function (text) {
//         assert.equal(text, '');
//       });
//     });
//   });
//
//   test('write text into an input element', function () {
//     return promise(driver.browser().activeWindow().getElement("q", cabbie.Element.SELECTOR_NAME)).then(function (element) {
//       return promise(element.sendKeys("test-45")).then(function () {
//         return promise(element.getAttribute('value'));
//       }).then(function (text) {
//         assert.equal(text, 'test-45');
//       });
//     });
//   });
//
//
//
//
//   test("get a server status", function () {
//     return promise(cabbie.Driver.getStatus(driver._options.remote, driver._options.mode)).then(function (status) {
//       assert(status instanceof cabbie.Status);
//
//       // Not required, but still execute and see if fails
//       status.getBuildVersion();
//       status.getBuildRevision();
//       status.getBuildTime();
//
//       // Sauce labs doesn't support these so we return undefined
//       status.getOSVersion();
//       status.getOSArchitecture();
//       status.getOSName();
//     });
//   });
//
// //  test("get a session list", function () {
// //    return promise(cabbie.Driver.getSessions(driver._options.remote, driver._options.mode)).then(function (result) {
// //      console.log(result);
// //    });
// //  });
//
//
//   test("get capabilities information", function () {
//     return promise(driver.session()).then(function (session) {
//       return session.capabilities();
//     });
//   });
//
//
//   test('get an element', function () {
//     return promise(driver.browser().activeWindow().getElement('h1'));
//   });
//   test('test whether an element is displayed', function () {
//     return promise(driver.browser().activeWindow().getElement('h1')).then(function (element) {
//       return promise(element.isDisplayed());
//     }).then(function (displayed) {
//       assert(displayed);
//       return promise(driver.browser().activeWindow().getElement('#hidden'));
//     }).then(function (element) {
//       return promise(element.isDisplayed());
//     }).then(function (displayed) {
//       assert(!displayed);
//     });
//   });
//   test('get an attribute of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#has-attribute')).then(function (element) {
//       return promise(element.getAttribute('data-attribute'));
//     }).then(function (name) {
//       assert.equal(name, 'value');
//     });
//   });
//
//
//
//   test('type text into an element', function () {
//     return promise(driver.browser().activeWindow().getElement('[name="q"]')).then(function (element) {
//       return promise(element.clear()).then(function () {
//         return promise(element.sendKeys('hello'));
//       }).then(function () {
//         return promise(element.sendKeys([' ', 'world']));
//       }).then(function () {
//         return promise(element.getAttribute('value'));
//       }).then(function (value) {
//         assert.equal(value, 'hello world');
//         return promise(element.clear());
//       }).then(function () {
//         return promise(element.getAttribute('value'));
//       }).then(function (value) {
//         assert.equal(value, '');
//       });
//     });
//   });
//   test('get the text content of an element', function () {
//     return promise(driver.browser().activeWindow().getElement('#has-text')).then(function (element) {
//       return promise(element.getText()).then(function (text) {
//         assert(text === 'test content');
//       });
//     });
//   });
//   test('click on a button', function () {
//     return promise(driver.browser().activeWindow().getElement('#clickable')).then(function (button) {
//       return promise(button.mouse().click()).then(function () {
//         return button.getText();
//       }).then(function (text) {
//         assert(text === 'clicked');
//       });
//     });
//   });
//
//   test('close the active window', function () {
//     return promise(driver.browser().activeWindow().close());
//   });
//
//   test('dispose the driver', function () {
//     return promise(driver.dispose({passed: true}));
//   });
// }
//
// var debug = process.argv.indexOf('--debug') !== -1 ||
//             process.argv.indexOf('-d') !== -1;
//
// if (process.argv.indexOf('--async') === -1) {
//   testBrowser('async', function () {
//     return getDriver({mode: 'sync', debug: debug, httpDebug: debug});
//   }, function (value) {
//     assert(!value || (typeof value !== 'object' && typeof value !== 'function') || typeof value.then !== 'function');
//     return Promise.resolve(value);
//   });
// }
// if (process.argv.indexOf('--sync') === -1) {
//   testBrowser('sync', function () {
//     return getDriver({mode: 'async', debug: debug, httpDebug: debug});
//   }, function (value) {
//     assert(value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function');
//     return value;
//   });
// }
