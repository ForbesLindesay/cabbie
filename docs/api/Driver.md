# Driver

Create a new Driver session, remember to call `.dispose()`
at the end to terminate the session.

## Static Properties

### MODE_SYNC: string

Sync-mode of web-driver requests

### MODE_ASYNC: string

Async-mode of web-driver requests

### APPLICATION_CACHE_UNCACHED: int

Status of the HTML5 application cache - Uncached

### APPLICATION_CACHE_IDLE: int

Status of the HTML5 application cache - Idle

### APPLICATION_CACHE_CHECKING: int

Status of the HTML5 application cache - Checking

### APPLICATION_CACHE_DOWNLOADING: int

Status of the HTML5 application cache - Downloading

### APPLICATION_CACHE_UPDATE_READY: int

Status of the HTML5 application cache - Update-ready

### APPLICATION_CACHE_OBSOLETE: int

Status of the HTML5 application cache - Obsolete

## Static Methods

### getStatus(remote: String, mode: String): Status

Gets the selenium-system status

### getSessions(remote: String, mode: string): Array.<Session>

Returns a list of the currently active sessions

Note: Appears not to be supported by the selenium-standalone-server!

## Instance Properties

### session

Get the session object of current session

### quit

End this Driver session

Alias for `dispose`

## Instance Methods

### browser()

Gets the browser object.
Direct-access. No need to wait.

### timeOut(): TimeOut

Get the time-out object.
Direct-access. No need to wait.

### getApplicationCacheStatus(): Number

Get the status of the html5 application cache

### getLogs(logType: String): Array.<LogEntry>

Get the log for a given log type. Log buffer is reset after each request.

### getLogTypes(): Array.<String>

Get available log types

### dispose([status]: Object)

End this Driver session

### sessionStorage(): SessionStorage

Get the Session-Storage object.
Direct-access. No need to wait.

### sauceJobUpdate(body: Object): Boolean

Sauce Labs Methods
