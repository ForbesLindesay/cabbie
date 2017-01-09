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
  getCookies(): Array<Cookie> {
    const cookies = this.requestJSON('GET', '');
    return cookies.map(cookie => new Cookie(cookie));
  }

  /**
   * Retrieve all cookie names visible to the current page.
   */
  getKeys(): Array<string> {
    const cookies = this.requestJSON('GET', '');
    return cookies.map(cookie => cookie.name);
  }

  /**
   * Retrieve a specific cookie by name that is visible to the current page.
   */
  getCookie(name: string): Cookie | undefined {
    let cookies = this.getCookies();
    cookies = cookies.filter(function (cookie) {
      return cookie.getName() == name;
    });
    return cookies.length ? cookies[0] : undefined;
  }

  /**
   * Set a cookie that is visible to the current page.
   */
  setCookie(cookie: Cookie): void {
    cookie.validate(true);

    if (cookie.getDomain() != null) {
      this.requestJSON('POST', '', { cookie: cookie.toObject() });
    } else {
      const base = this.driver.browser.activeWindow.navigator.getUrl();
      cookie.setDomain(url.parse(base).hostname);
      this.requestJSON('POST', '', { cookie: cookie.toObject() });
    }
  }

  /**
   * Delete the cookie with the given name.
   */
  removeCookie(name: string): void {
    this.requestJSON('DELETE', '/' + name);
  }

  /**
   * Delete all cookies visible to the current page.
   */
  clear(): void {
    this.requestJSON('DELETE', '');
  }

  /**
   * Get the number of items in the storage
   */
  getSize(): Number {
    const cookies = this.getCookies();
    return cookies.length;
  }
}

export default CookieStorage;