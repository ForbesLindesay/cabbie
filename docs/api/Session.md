# Session

Session entry

## Static Properties

### CAPABILITY_BROWSER_NAME: String

Request for a specific browser

### CAPABILITY_VERSION: String

Request for a specific browser version

### CAPABILITY_PLATFORM: String

Request for a specific platform

### CAPABILITY_JAVASCRIPT_ENABLED: String

Request for JavaScript to be enabled in the browser

### CAPABILITY_TAKES_SCREENSHOT: String

Request for screenshot support

### CAPABILITY_HANDLES_ALERT: String

Request for alert handling support

### CAPABILITY_DATABASE_ENABLED: String

Request for the browser database to be enabled

### CAPABILITY_LOCATION_CONTEXT_ENABLED: String

Request for the browser location API to be enabled

### CAPABILITY_APPLICATION_CACHE_ENABLED: String

Request for the browser cache to be enabled

### CAPABILITY_BROWSER_CONNECTION_ENABLED: String

Request for the ability to query the browsers connectivity

### CAPABILITY_CSS_SELECTORS_ENABLED: String

Request for native css selector support.

Note: This should always be requested since this is the default for Cabbie.

### CAPABILITY_WEB_STORAGE_ENABLED: String

Request for the web-storage to be enabled

### CAPABILITY_ROTATABLE: String

Request for a browser that can be rotated (orientation).

### CAPABILITY_ACCEPT_SSL_CERTS: String

Request for the browser to accept any ssl certificates

### CAPABILITY_NATIVE_EVENTS: String

Request for native-events

### CAPABILITY_PROXY: String

Request for a proxy

## Instance Methods

### id(): String

Get the session-id.
Direct-access. No need to wait.

### capabilities(): Object

Get all the accepted capabilities.
Direct-access. No need to wait.
