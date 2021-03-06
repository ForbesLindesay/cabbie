import type {Options} from './flow-types/options';
import type {Session} from './flow-types/session-data';
import Connection from './connection';
import Debug from './debug';
import Driver from './driver';
import parseResponse from './utils/parse-response';
import Status from './status';
import waitFor from './utils/wait-for';

export {Connection, Debug, Driver, Status};

/*
 * Create a new cabbie Driver. See [getting started](/getting-started) for examples.
 */
export default function createCabbieDriver(remote: string, options: Options = {}): Driver {
  return new Driver(remote, options);
}

export type {Options};
/*
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!
 */
export async function getSessions(remote: string, options: Options = {}): Promise<Array<Session>> {
  const connection = new Connection(remote, remote, new Debug(options));
  const rawSessions = await connection.request('GET', '/sessions');
  const sessions = parseResponse(rawSessions);
  return sessions.map(session => ({sessionID: session.id, capabilities: session.capabilities}));
}

/*
 * Gets the selenium-system status
 */
export async function getStatus(remote: string, options: Options = {}): Promise<Status> {
  const connection = new Connection(remote, remote, new Debug(options));
  const rawResponse = await connection.request('GET', '/status');
  const response = parseResponse(rawResponse);
  return new Status(response);
}

let chromedriverRunning = false;
/*
 * Start a chromedriver instance.  You must have installed chromedriver to use this:
 *
 * ```
 * npm install chromedriver --save-dev
 * ```
 */
export function startChromedriver(): void {
  if (chromedriverRunning) {
    return;
  }
  let chromedriver;
  try {
    chromedriver = (require: any)('chromedriver');
  } catch (ex) {
    throw new Error(
      'You must install the chromedriver module via "npm install chromedriver --save-dev" to call ' +
        'cabbie.startChromedriver();',
    );
  }
  const cd = chromedriver;
  cd.start().unref();
  process.once('exit', code => {
    cd.stop();
  });
  chromedriverRunning = true;
}

export {waitFor};
