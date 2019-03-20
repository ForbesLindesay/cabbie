import {Options} from './flow-types/options';
import Driver from './driver';
import {resolve} from 'url';
import addDebugging from './add-debugging';
import BaseClass from './base-class';

/**
 * Navigation object
 *
 * @deprecated These methods all now live directly on the "ActiveWindow" object.
 */
class Navigator extends BaseClass {
  _options: Options;

  constructor(driver: Driver, options: Options) {
    super(driver);
    this._options = options;
  }

  /**
   * Navigate forwards in the browser history, if possible.
   */
  async forward(): Promise<void> {
    await this.requestJSON('POST', '/forward');
  }

  /**
   * Navigate backwards in the browser history, if possible.
   */
  async backward(): Promise<void> {
    await this.requestJSON('POST', '/back');
  }

  /**
   * Refreshes the browser
   */
  async refresh(): Promise<void> {
    await this.requestJSON('POST', '/refresh');
  }

  /**
   * Get the current url that the browser is displaying
   */
  async getUrl(): Promise<string> {
    return await this.requestJSON('GET', '/url');
  }

  /**
   * Navigates the browser to the specified path
   *
   *  - if `path` begins with a "/" it is relative to `options.base`
   *  - if `path` begins with "http" it is absolute
   *  - otherwise it is relative to the current path
   */
  async navigateTo(path: string): Promise<void> {
    if (path[0] === '/') {
      const base = this._options.base;
      if (!base) {
        throw new Error(
          'You must provide a "base" option to use urls starting with "/"',
        );
      }
      path = base.replace(/\/$/, '') + path;
    } else if (path.indexOf('http') !== 0) {
      const base = await this.getUrl();
      await this.navigateTo(resolve(base, path));
      return;
    }

    await this.driver.requestJSON('POST', '/url', {url: path});
  }
}

/**
 * Navigates the browser to the specified path
 *
 * Alias for `navigateTo`
 *
 * @method setUrl
 * @param {String} path
 */
(Navigator.prototype as any).setUrl = Navigator.prototype.navigateTo;
addDebugging(Navigator);
export default Navigator;
