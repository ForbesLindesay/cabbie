module.exports = Status;

/**
 * Selenium status
 */
class Status {
  constructor(values) {
    this._values = values;
  }

  /**
   * A generic release label
   */
  getBuildVersion(): string {
    return this._values.build && this._values.build.version;
  }

  /**
   * The revision of the local source control client from which the server was built
   */
  getBuildRevision(): string {
    return this._values.build && this._values.build.revision;
  }

  /**
   * A timestamp from when the server was built.
   */
  getBuildTime(): number {
    return this._values.build && this._values.build.time;
  }

  /**
   * The current system architecture.
   */
  getOSArchitecture(): string {
    return this._values.os && this._values.os.arch;
  }

  /**
   * The name of the operating system the server is currently running on: "windows", "linux", etc.
   */
  getOSName(): string {
    return this._values.os && this._values.os.name;
  }

  /**
   * The operating system version.
   */
  getOSVersion(): string {
    return this._values.os && this._values.os.version;
  }
}
