import type {LogLevel} from './enums/log-levels';

/**
 * Remote log-entry
 */
class LogEntry {
  constructor(values: Object) {
    this._values = values;
  }

  /**
   * The timestamp of the entry.
   */
  getTimestamp(): number {
    return this._values.timestamp;
  }

  /**
   * The log level of the entry.
   */
  getLevel(): LogLevel {
    return this._values.level;
  }

  /**
   * The log message.
   */
  getMessage(): string {
    return this._values.message;
  }
}

export default LogEntry;
