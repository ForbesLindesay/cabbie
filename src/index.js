import Connection from "./connection";
import Driver from './driver';
import Session from "./session";
import Status from "./status";
import parseResponse from './utils/parse-response';

export default function createCabbieDriver(remote: string, capabilities: Object, options: Object): Driver {
  return new Driver(remote, capabilities, options);
}

/**
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!}
 */
export async function getSessions(remote: string): Promise<Array<Session>> {
  const connection = new Connection(remote);
  const rawSessions = await connection.request('GET', '/sessions');
  const sessions = parseResponse(rawSessions);
  return sessions.map(session => new Session(session));
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
