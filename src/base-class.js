class BaseClass {
  driver: Driver;
  _prefix: string;
  constructor(driver: Driver, prefix?: string) {
    this.driver = driver;
    this._prefix = prefix || '';
  }
  requestJSON(method: Method, path: string, body: Object): Promise<Object> {
    return this.driver.requestJSON(method, this._prefix + path, body);
  }
}
export default BaseClass;
