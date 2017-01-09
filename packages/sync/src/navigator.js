import BaseClass from './base-class';

/**
 * Navigation object
 */
class Navigator extends BaseClass {
  /**
   * Navigate forwards in the browser history, if possible.
   */
  forward(): void {
    this.requestJSON('POST', '/forward');
  }

  /**
   * Navigate backwards in the browser history, if possible.
   */
  backward(): void {
    this.requestJSON('POST', '/back');
  }

  /**
   * Refreshes the browser
   */
  refresh(): void {
    this.requestJSON('POST', '/refresh');
  }

  /**
   * Get the current url that the browser is displaying
   */
  getUrl(): string {
    return this.requestJSON('GET', '/url');
  }

  /**
   * Navigates the browser to the specified path
   *
   *  - if `path` begins with a "/" it is relative to `options.base`
   *  - if `path` begins with "http" it is absolute
   *  - otherwise it is relative to the current path
   */
  navigateTo(path: string): void {
    if (path[0] === '/') {
      path = this._options.base.replace(/\/$/, '') + path;
    } else if (path.indexOf('http') !== 0) {
      const base = this.getUrl();
      this.navigateTo(url.resolve(base, path));
      return;
    }

    this.requestJSON('POST', '/url', { url: path });
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
Navigator.prototype.setUrl = Navigator.prototype.navigateTo;