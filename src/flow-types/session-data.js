/*
 * An object representing the session state.  You can pass a session to createCabbieDriver to create a new
 * driver from an existing session.  e.g.
 *
 * ```js
 * const driver = createCabbieDriver(oldDriver.remote, {...oldDriver.options, session: await oldDriver.session});
 * ```
 */
export type Session = {
  /*
   * The selenium ID of the current session
   */
  sessionID: string,
  /*
   * An object representing the capabilities that the selenium server says it supports.
   */
  capabilities: Object,
};
