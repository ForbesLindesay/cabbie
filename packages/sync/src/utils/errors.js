'use strict';

// This file lists the status values that can be returned
// along with their name/meaning.
//
// source: https://code.google.com/p/selenium/wiki/JsonWireProtocol#Response_Status_Codes


//////////////////
// Enumerations //
//////////////////

/**
 * List of errors
 *
 * @type {Object}
 */

export const names = {
  '6': 'NoSuchDriver',
  '7': 'NoSuchElement',
  '8': 'NoSuchFrame',
  '9': 'UnknownCommand',
  '10': 'StaleElementReference',
  '11': 'ElementNotVisible',
  '12': 'InvalidElementState',
  '13': 'UnknownError',
  '15': 'ElementIsNotSelectable',
  '17': 'JavaScriptError',
  '19': 'XPathLookupError',
  '21': 'Timeout',
  '23': 'NoSuchWindow',
  '24': 'InvalidCookieDomain',
  '25': 'UnableToSetCookie',
  '26': 'UnexpectedAlertOpen',
  '27': 'NoAlertOpenError',
  '28': 'ScriptTimeout',
  '30': 'IMENotAvailable',
  '31': 'IMEEngineActivationFailed',
  '32': 'InvalidSelector',
  '33': 'SessionNotCreatedException',
  '34': 'MoveTargetOutOfBounds'
};

////////////////////
// Public Methods //
////////////////////

/**
 * Extracts the error message from a response body
 */
export function fromBody(body: Object): string {
  var msg = (names[body.status] || 'UnknownError') + '(' + body.status + '): ';
  if (body.value && body.value.message) msg += body.value.message;else msg += body.value;
  return msg;
}