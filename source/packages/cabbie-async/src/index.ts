import {Options} from './flow-types/options';
import {Session} from './flow-types/session-data';
import Connection from './connection';
import Debug from './debug';
import Driver from './driver';
import parseResponse from './utils/parse-response';
import Status from './status';
import waitFor from './utils/wait-for';
import startChromedriver from './startChromedriver';
import resolveConfig from './config';

export {Connection, Debug, Driver, Status};

/**
 * Create a new cabbie Driver. See [getting started](/getting-started) for examples.
 */
export default function createCabbieDriver(
  remote: string,
  options: Options = {},
): Driver {
  return new Driver(remote, options);
}

export {Options};
/**
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!
 */
export async function getSessions(
  remote: string,
  options: Options = {},
): Promise<Array<Session>> {
  const resolved = resolveConfig(remote, options);
  const connection = new Connection(
    resolved.remote,
    resolved.remoteURI,
    new Debug(resolved.options),
  );
  const rawSessions = await connection.request('GET', '/sessions');
  const sessions = parseResponse(rawSessions);
  return sessions.map((session: any) => ({
    sessionID: session.id,
    capabilities: session.capabilities,
  }));
}

/**
 * Gets the selenium-system status
 */
export async function getStatus(
  remote: string,
  options: Options = {},
): Promise<Status> {
  const resolved = resolveConfig(remote, options);
  const connection = new Connection(
    resolved.remote,
    resolved.remoteURI,
    new Debug(resolved.options),
  );
  const rawResponse = await connection.request('GET', '/status');
  const response = parseResponse(rawResponse);
  return new Status(response);
}

export {waitFor, startChromedriver};

// BEGIN_GENERATED_CODE

import ActiveWindow from './active-window';
import Alert from './alert';
import ApplicationCacheStatuses from './enums/application-cache-statuses';
import Browser from './browser';
import BrowserOrientations from './enums/browser-orientations';
import Capabilities from './enums/capabilities';
import CookieStorage from './cookie-storage';
import Element from './element';
import Frame from './frame';
import GlobalMouse from './global-mouse';
import GlobalTouch from './global-touch';
import IME from './ime';
import KeyboardKeys from './enums/keyboard-keys';
import LocalStorage from './local-storage';
import LogLevels from './enums/log-levels';
import LogSources from './enums/log-sources';
import Modes from './enums/modes';
import Mouse from './mouse';
import MouseButtons from './enums/mouse-buttons';
import Navigator from './navigator';
import SelectorTypes from './enums/selector-types';
import SessionStorage from './session-storage';
import TimeOut from './time-out';
import TimeOutTypes from './enums/time-out-types';
import Touch from './touch';
import WindowHandle from './window-handle';

export {
  ActiveWindow,
  Alert,
  ApplicationCacheStatuses,
  Browser,
  BrowserOrientations,
  Capabilities,
  CookieStorage,
  Element,
  Frame,
  GlobalMouse,
  GlobalTouch,
  IME,
  KeyboardKeys,
  LocalStorage,
  LogLevels,
  LogSources,
  Modes,
  Mouse,
  MouseButtons,
  Navigator,
  SelectorTypes,
  SessionStorage,
  TimeOut,
  TimeOutTypes,
  Touch,
  WindowHandle,
};
