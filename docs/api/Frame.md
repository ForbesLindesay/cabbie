# Frame

Managing session-storage

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### activateDefault()

Change focus to the default context on the page

### activate(id: String)

Change focus to a specific frame on the page

### activateParent()

Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
