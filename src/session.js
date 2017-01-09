/**
 * Selenium session
 */
class Session {
  _values: Object;
  constructor(values: Object) {
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

export default Session;
