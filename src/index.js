import type {Options} from './flow-types/options';
import type {SessionData} from './flow-types/session-data';
import Connection from './connection';
import Debug from './debug';
import Driver from './driver';
import parseResponse from './utils/parse-response';
import Status from './status';

export {Connection, Debug, Driver, Status};
export default function createCabbieDriver(remote: string, options: Options = {}): Driver {
  return new Driver(remote, options);
}

export type {Options};
/**
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!}
 */
export async function getSessions(remote: string, options: Options = {}): Promise<Array<SessionData>> {
  const connection = new Connection(remote, new Debug(options));
  const rawSessions = await connection.request('GET', '/sessions');
  const sessions = parseResponse(rawSessions);
  return sessions.map(session => ({sessionID: session.id, capabilities: session.capabilities}));
};

/**
 * Gets the selenium-system status
 */
export async function getStatus(remote: string, options: Options = {}): Promise<Status> {
  const connection = new Connection(remote, new Debug(options));
  const rawResponse = await connection.request('GET', '/status');
  const response = parseResponse(rawResponse);
  return new Status(response);
};
