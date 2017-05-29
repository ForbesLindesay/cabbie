import url from 'url';
import addDebugging from './add-debugging';
import BaseClass from './base-class';

/*
 * Navigation object
 *
 * @deprecated These methods all now live directly on the "ActiveWindow" object.
 */
class Navigator extends BaseClass {
  /*
   * Navigate forwards in the browser history, if possible.
   */
  async forward(): Promise<void> {
    await this.requestJSON('POST', '/forward');
  }

  /*
   * Navigate backwards in the browser history, if possible.
   */
  async backward(): Promise<void> {
    await this.requestJSON('POST', '/back');
  }

  /*
   * Refreshes the browser
   */
  async refresh(): Promise<void> {
    await this.requestJSON('POST', '/refresh');
  }

  /*
   * Get the current url that the browser is displaying
   */
  async getUrl(): Promise<string> {
    return await this.requestJSON('GET', '/url');
  }

  /*
   * Navigates the browser to the specified path
   *
   *  - if `path` begins with a "/" it is relative to `options.base`
   *  - if `path` begins with "http" it is absolute
   *  - otherwise it is relative to the current path
   */
  async navigateTo(path: string): Promise<void> {
    if (path[0] === '/') {
      // $FlowFixMe: WTF!
      path = this._options.base.replace(/\/$/, '') + path;
    } else if (path.indexOf('http') !== 0) {
      const base = await this.getUrl();
      await this.navigateTo(url.resolve(base, path));
      return;
    }

    await this.requestJSON('POST', '/url', {url: path});
  }
}

/*
 * Navigates the browser to the specified path
 *
 * Alias for `navigateTo`
 *
 * @method setUrl
 * @param {String} path
 */
(Navigator.prototype: any).setUrl = Navigator.prototype.navigateTo;
addDebugging(Navigator);
export default Navigator;
