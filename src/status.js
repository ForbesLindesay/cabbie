/*
 * Selenium status
 */
class Status {
  _values: Object;

  constructor(values: Object) {
    this._values = values;
  }

  /*
   * A generic release label
   */
  getBuildVersion(): string | void {
    return this._values.build && this._values.build.version;
  }

  /*
   * The revision of the local source control client from which the server was built
   */
  getBuildRevision(): string | void {
    return this._values.build && this._values.build.revision;
  }

  /*
   * A timestamp from when the server was built.
   */
  getBuildTime(): number | void {
    return this._values.build && this._values.build.time;
  }

  /*
   * The current system architecture.
   */
  getOSArchitecture(): string | void {
    return this._values.os && this._values.os.arch;
  }

  /*
   * The name of the operating system the server is currently running on: "windows", "linux", etc.
   */
  getOSName(): string | void {
    return this._values.os && this._values.os.name;
  }

  /*
   * The operating system version.
   */
  getOSVersion(): string | void {
    return this._values.os && this._values.os.version;
  }
}

export default Status;
