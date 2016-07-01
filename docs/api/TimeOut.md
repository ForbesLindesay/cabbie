# TimeOut

Managing time-out

## Static Properties

### TIMEOUT_TYPE_SCRIPT: String

Synchronous script execution timeout

### TIMEOUT_TYPE_ASYNC_SCRIPT: String

Asynchronous script execution timeout

### TIMEOUT_TYPE_PAGE_LOAD: String

Page load timeout

### TIMEOUT_TYPE_IMPLICIT: String

Implicit wait timeout.
Implicit waits are applied for all requests.

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### setTimeOut(timeOutType: String, ms: Number)

Set a time-out

### setTimeOuts(timeOuts: Object)

Set multiple time-outs at once

### setScriptTimeOut(timeout: Number)

Set the amount of time, in milliseconds, that scripts are permitted
to run before they are aborted and a "Timeout" error is returned to the client.

### setAsyncScriptTimeOut(timeout: Number)

Set the amount of time, in milliseconds, that asynchronous scripts are permitted
to run before they are aborted and a "Timeout" error is returned to the client.

### setPageLoadTimeOut(timeout: Number)

Set the amount of time, in milliseconds, that a page is permitted to be loaded
before they it is aborted and a "Timeout" error is returned to the client.

### setImplicitTimeOut(timeout: Number)

Set the amount of time, in milliseconds, that scripts executed are permitted
to run before they are aborted and a "Timeout" error is returned to the client.
