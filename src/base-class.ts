import {HttpMethod} from './flow-types/http-method';
import {WebdriverResponse} from './flow-types/webdriver-response';
import Debug from './debug';
import Driver from './driver';

class BaseClass {
  /**
   * Reference to the debug context
   *
   * @private
   */
  debug: Debug;

  /**
   * Reference to the driver object
   *
   * @private
   */
  driver: Driver;

  _prefix: string;

  constructor(driver: Driver, prefix?: string) {
    this.driver = driver;
    this.debug = driver.debug;
    this._prefix = prefix || '';
  }

  /**
   * Make a request with session info and the path prefix
   *
   * @private
   */
  requestJSON(method: HttpMethod, path: string, body?: any): Promise<WebdriverResponse> {
    return this.driver.requestJSON(method, this._prefix + path, body);
  }
}
export default BaseClass;
