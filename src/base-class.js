import type {HttpMethod} from './flow-types/http-method';
import type {WebdriverResponse} from './flow-types/webdriver-response';
import type Debug from './debug';
import type Driver from './driver';

class BaseClass {
  /*
   * Reference to the debug context
   *
   * @private
   */
  debug: Debug;

  /*
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

  /*
   * Make a request with session info and the path prefix
   *
   * @private
   */
  requestJSON(method: HttpMethod, path: string, body?: Object): Promise<WebdriverResponse> {
    return this.driver.requestJSON(method, this._prefix + path, body);
  }
}
export default BaseClass;
