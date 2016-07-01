# CookieStorage

Managing cookie-storage

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### getCookies(): Array.<Cookie>

Retrieve all cookies visible to the current page.

### getKeys(): Array.<String>

Retrieve all cookie names visible to the current page.

### getCookie(name: String): Cookie

Retrieve a specific cookie by name that is visible to the current page.

### setCookie(cookie: Cookie)

Set a cookie that is visible to the current page.

### removeCookie(name: String)

Delete the cookie with the given name.

### clear()

Delete all cookies visible to the current page.

### getSize(): Number

Get the number of items in the storage
