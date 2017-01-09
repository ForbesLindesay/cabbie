import type Driver from './driver';
import url from 'url';
import Cookie from './cookie';
import BaseClass from './base-class';

/**
 * Managing cookie-storage
 */
class CookieStorage extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/cookie');
  }

  /**
   * Retrieve all cookies visible to the current page.
   */
  async getCookies(): Promise<Array<Cookie>> {
    const cookies = await this.requestJSON('GET', '');
    return cookies.map(cookie => new Cookie(cookie));
  }

  /**
   * Retrieve all cookie names visible to the current page.
   */
  async getKeys(): Promise<Array<string>> {
    const cookies = await this.requestJSON('GET', '');
    return cookies.map(cookie => cookie.name);
  }

  /**
   * Retrieve a specific cookie by name that is visible to the current page.
   */
  async getCookie(name: string): Promise<Cookie | void> {
    let cookies = await this.getCookies();
    cookies = cookies.filter(function (cookie) {
      return cookie.getName() == name;
    });
    return cookies.length ? cookies[0] : undefined;
  }

  /**
   * Set a cookie that is visible to the current page.
   */
  async setCookie(cookie: Cookie): Promise<void> {
    cookie.validate(true);

    if (cookie.getDomain() != null) {
      await this.requestJSON('POST', '', { cookie: cookie.toObject() });
    } else {
      const base = await this.driver.browser.activeWindow.navigator.getUrl();
      // $FlowFixMe: hostname should never be undefined
      const hostname: string = url.parse(base).hostname;
      cookie.setDomain(hostname);
      await this.requestJSON('POST', '', { cookie: cookie.toObject() });
    }
  }

  /**
   * Delete the cookie with the given name.
   */
  async removeCookie(name: string): Promise<void> {
    await this.requestJSON('DELETE', '/' + name);
  }

  /**
   * Delete all cookies visible to the current page.
   */
  async clear(): Promise<void> {
    await this.requestJSON('DELETE', '');
  }

  /**
   * Get the number of items in the storage
   */
  async getSize(): Promise<number> {
    const cookies = await this.getCookies();
    return cookies.length;
  }
}

export default CookieStorage;
