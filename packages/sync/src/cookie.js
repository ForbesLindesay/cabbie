type CookieData = {
  name?: string;
  value?: string;
  path?: string;
  domain?: string;
};

/**
 * Cookie data-structure
 */
class Cookie {
  _values: CookieData;

  constructor(values: CookieData) {
    this._values = values || {};
    this.validate();
  }

  ////////////////////
  // Public Methods //
  ////////////////////

  /**
   * The name of the cookie.
   */
  getName(): string | void {
    return this._values.name;
  }

  /**
   * The name of the cookie.
   */
  setName(name: string) {
    this._values.name = name;
    this.validate();
  }

  /**
   * The cookie value.
   */
  getValue(): string | void {
    return this._values.value;
  }

  /**
   * The cookie value.
   */
  setValue(value: string) {
    this._values.value = value;
    this.validate();
  }

  /**
   * (Optional) The cookie path.
   */
  getPath(): string | void {
    return this._values.path;
  }

  /**
   * Set the cookie path.
   */
  setPath(path: string): void {
    this._values.path = path;
    this.validate();
  }

  /**
   * (Optional) The domain the cookie is visible to.
   */
  getDomain(): string | void {
    return this._values.domain;
  }

  /**
   * Set the domain the cookie is visible to.
   */
  setDomain(domain: string) {
    this._values.domain = domain;
    this.validate();
  }

  /**
   * (Optional) Whether the cookie is a secure cookie.
   */
  isSecure(): Boolean | void {
    return this._values.secure;
  }

  /**
   * Set whether the cookie is a secure cookie.
   */
  setSecure(secure: Boolean) {
    this._values.secure = secure;
    this.validate();
  }

  /**
   * (Optional) Whether the cookie is an httpOnly cookie.
   */
  isHttpOnly(): Boolean | void {
    return this._values.httpOnly;
  }

  /**
   * Set whether the cookie is an httpOnly cookie.
   */
  setHttpOnly(httpOnly: Boolean) {
    this._values.httpOnly = httpOnly;
    this.validate();
  }

  /**
   * (Optional) When the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
   */
  getExpiry(): Number | void {
    return this._values.expiry;
  }

  /**
   * Set when the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
   */
  setExpiry(expiry: Number) {
    this._values.expiry = expiry;
    this.validate();
  }

  /**
   * Get cookie data-structure
   */
  toObject(): CookieData {
    return this._values;
  }

  /**
   * Validate the cookie data
   */
  validate(completed: boolean = false) {
    if (completed) {
      if (!this._values.name) {
        throw new Error('A cookie "name" is required.');
      }
      if (!this._values.value) {
        throw new Error('a cookie "value" is required.');
      }
    }

    if (!this._values.path) {
      this._values.path = '/';
    }

    // localhost is a special case, the domain must be ""
    if (this._values.domain === 'localhost') this._values.domain = '';
  }
}

export default Cookie;