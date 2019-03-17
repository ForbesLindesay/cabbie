import LogLevel from './enums/log-levels';

/**
 * Remote log-entry
 */
export type LogEntry = {
  /**
   * The timestamp of the entry.
   */
  timestamp: number,
  /**
   * The log level of the entry.
   */
  level: LogLevel,
  /**
   * The log message.
   */
  message: string,
};
