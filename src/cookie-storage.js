import type {Cookie} from './cookie';
import type Driver from './driver';
import addDebugging from './add-debugging';
import url from 'url';
import BaseClass from './base-class';

/*
 * Validate the cookie data
 *
 * @private
 */
function validateCookie(cookie: Cookie, completed: boolean = false) {
  if (completed) {
    if (!cookie.name) {
      throw new Error('A cookie "name" is required.');
    }
    if (!cookie.value) {
      throw new Error('a cookie "value" is required.');
    }
  }

  if (!cookie.path) {
    cookie.path = '/';
  }

  // localhost is a special case, the domain must be ""
  if (cookie.domain === 'localhost') cookie.domain = '';

  return cookie;
}

/*
 * Managing cookie-storage
 */
class CookieStorage extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/cookie');
  }

  /*
   * Retrieve all cookies visible to the current page.
   */
  async getCookies(): Promise<Array<Cookie>> {
    return await this.requestJSON('GET', '');
  }

  /*
   * Retrieve all cookie names visible to the current page.
   */
  async getKeys(): Promise<Array<string>> {
    const cookies = await this.requestJSON('GET', '');
    return cookies.map(cookie => cookie.name);
  }

  /*
   * Retrieve a specific cookie by name that is visible to the current page.
   */
  async getCookie(name: string): Promise<Cookie | void> {
    let cookies = await this.getCookies();
    cookies = cookies.filter(cookie => {
      return cookie.name == name;
    });
    return cookies.length ? cookies[0] : undefined;
  }

  /*
   * Set a cookie that is visible to the current page.
   */
  async setCookie(cookie: Cookie): Promise<void> {
    validateCookie(cookie, true);

    if (cookie.domain != null) {
      await this.requestJSON('POST', '', {cookie});
    } else {
      const base = await this.driver.browser.activeWindow.getUrl();
      const hostname = url.parse(base).hostname;
      if (hostname == null) {
        throw new Error('The hostname should never be undefined. This should never happen.');
      }
      cookie.domain = hostname;
      validateCookie(cookie, true);
      await this.requestJSON('POST', '', {cookie});
    }
  }

  /*
   * Delete the cookie with the given name.
   */
  async removeCookie(name: string): Promise<void> {
    await this.requestJSON('DELETE', '/' + name);
  }

  /*
   * Delete all cookies visible to the current page.
   */
  async clear(): Promise<void> {
    await this.requestJSON('DELETE', '');
  }

  /*
   * Get the number of items in the storage
   */
  async getSize(): Promise<number> {
    const cookies = await this.getCookies();
    return cookies.length;
  }
}
addDebugging(CookieStorage);
export default CookieStorage;
