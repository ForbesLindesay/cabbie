import type {WebdriverResponse} from '../flow-types/webdriver-response';
import {fromBody} from './errors';

/**
 * Parse a webdriver response, throwing errors if the status suggests it
 */
function parseResponse(res: Object): WebdriverResponse {
  var body;

  if (res.statusCode >= 0 && res.statusCode < 100) {
    throw new Error('Server responded with status code (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode >= 400 && res.statusCode < 500) { // 400s
    throw new Error('Invalid request (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode >= 500 && res.statusCode < 600) { // 500s
    body = JSON.parse(res.body);

    throw new Error("Failed command (" + res.statusCode + "):\n" + body.value.message + (body.value.class ? "\nClass: " + body.value.class : "") + (body.value.stackTrace ? "\nStack-trace:\n " + stringifyStackTrace(body.value.stackTrace) : ""));
  } else if (res.statusCode >= 200 && res.statusCode < 300) {

    if (res.statusCode === 204) {
      return null;

    } else {
      body = JSON.parse(res.body);

      if (body.status === 0) {
        return body.value;
      } else {
        throw new Error(fromBody(body));
      }
    }

  } else {
    throw new Error('Unknown status code (' + res.statusCode + '):\n' + res.body);
  }
}

/**
 * Turns a selenium stack-trace into a string
 */
function stringifyStackTrace (stackTrace: Array<Object>): string {

  var i, len, result = [];

  for (i = 0, len = stackTrace.length; i < len; i++) {
    if (stackTrace[i]) {
      result.push(
        stackTrace[i].methodName + "::" + stackTrace[i].className +
        " (" + stackTrace[i].fileName + ":" + stackTrace[i].lineNumber + ")"
      );
    }
  }

  return result.join("\n");
}

export default parseResponse;