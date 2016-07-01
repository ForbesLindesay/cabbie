# Navigator

Navigation object

## Instance Properties

### setUrl

Navigates the browser to the specified path

Alias for `navigateTo`

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### forward()

Navigate forwards in the browser history, if possible.

### backward()

Navigate backwards in the browser history, if possible.

### refresh()

Refreshes the browser

### getUrl(): String

Get the current url that the browser is displaying

### navigateTo(path: String)

Navigates the browser to the specified path

 - if `path` begins with a "/" it is relative to `options.base`
 - if `path` begins with "http" it is absolute
 - otherwise it is relative to the current path
