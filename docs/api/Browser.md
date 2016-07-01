# Browser

Browser accessor class

## Static Properties

### ORIENTATION_LANDSCAPE: string

Landscape orientation of the device

### ORIENTATION_PORTRAIT: string

Portrait orientation of the device

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### activateWindow(handle: WindowHandler)

Change focus to another window

### activeWindow(): ActiveWindow

Get the currently active window.
Direct-access. No need to wait.

### getWindows(): Array.<WindowHandler>

Get an array of windows for all available windows

### getOrientation(): String

Get the current browser orientation

### setOrientation(orientation: String)

Get the current browser orientation

### getGeoLocation(): Object

Get the current geo location

### setGeoLocation(latitude: Number, longitude: Number, altitude: Number)

Set the current geo location

### ime(): IME

Get the IME object.
Direct-access. No need to wait.

### cookieStorage(): CookieStorage

Get the Cookie-Storage object.
Direct-access. No need to wait.

### localStorage(): LocalStorage

Get the Local-Storage object.
Direct-access. No need to wait.
