import type {Options} from './flow-types/options';
import type {SessionData} from './flow-types/session-data';
import Connection from './connection';
import Driver from './driver';
import Status from './status';
import parseResponse from './utils/parse-response';

export {Driver};
export default function createCabbieDriver(remote: string, options: Options = {}): Driver {
  return new Driver(remote, options);
}

/**
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!}
 */
export async function getSessions(remote: string): Promise<Array<SessionData>> {
  const connection = new Connection(remote);
  const rawSessions = await connection.request('GET', '/sessions');
  const sessions = parseResponse(rawSessions);
  return sessions.map(session => ({sessionID: session.sessionId, capabilities: session.capabilities}));
};

/**
 * Gets the selenium-system status
 */
export async function getStatus(remote: string): Promise<Status> {
  const connection = new Connection(remote);
  const rawResponse = await connection.request('GET', '/status');
  const response = parseResponse(rawResponse);
  return new Status(response);
};
