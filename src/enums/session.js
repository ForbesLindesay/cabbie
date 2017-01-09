/**
 * Selenium session
 */
class Session {
  constructor(values) {
    this._values = values;
  }

  /**
   * Get the session-id.
   */
  id(): string {
    return this._values.sessionId;
  }

  /**
   * Get all the accepted capabilities.
   */
  capabilities(): Object {
    return this._values.capabilities;
  }
}
