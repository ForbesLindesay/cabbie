import type {HttpMethod} from './flow-types/http-method';
import type {WebdriverResponse} from './flow-types/webdriver-response';
import type Debug from './debug';
import type Driver from './driver';

class BaseClass {
  debug: Debug;
  driver: Driver;
  _prefix: string;
  constructor(driver: Driver, prefix?: string) {
    this.driver = driver;
    this.debug = driver.debug;
    this._prefix = prefix || '';
  }
  requestJSON(method: HttpMethod, path: string, body?: Object): Promise<WebdriverResponse> {
    return this.driver.requestJSON(method, this._prefix + path, body);
  }
}
export default BaseClass;
