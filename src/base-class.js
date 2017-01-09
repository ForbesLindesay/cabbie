import type Driver from './driver';
import type {HttpMethod} from './flow-types/http-method';
import type {WebdriverResponse} from './flow-types/webdriver-response';

class BaseClass {
  driver: Driver;
  _prefix: string;
  constructor(driver: Driver, prefix?: string) {
    this.driver = driver;
    this._prefix = prefix || '';
  }
  requestJSON(method: HttpMethod, path: string, body?: Object): Promise<WebdriverResponse> {
    return this.driver.requestJSON(method, this._prefix + path, body);
  }
}
export default BaseClass;
