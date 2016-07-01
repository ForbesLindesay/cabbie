# ActiveWindow (extends [WindowHandler](WindowHandler.md))

Active window object

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### execute(script: String | Function, [args]: Array): any

Execute a script on the browser and return the result.

Source should be either a function body as a string or a function.
Keep in mind that if it is a function it will not have access to
any variables from the node.js process.

### asyncExecute(script: String | Function, [args]: Array)

Execute a script asynchronously on the browser.

Source should be either a function body as a string or a function.
Keep in mind that if it is a function it will not have access to
any variables from the node.js process.

### sendKeys(str: String | Array.<String>)

Type a string of characters into the browser

Note: Modifier keys is kept between calls, so mouse interactions can be performed
while modifier keys are depressed.

### takeScreenshot(): Buffer

Take a screenshot of the current page

### getActiveElement(): Element

Get the element on the page that currently has focus

### getElement(selector: String, [selectorType='css: String): Element

Get an element via a selector.
Will throw an error if the element does not exist.

### getElements(selector: String, [selectorType='css: String): Array.<Element>

Get elements via a selector.

### hasElement(selector: String, [selectorType='css: String): boolean

Does a specific element exist?

### close()

Close the current window

### getTitle(): String

Get the current page title

### getSource(): String

Get the current page source

### touch(): GlobalTouch

Get the global-touch object.
Direct-access. No need to wait.

### mouse(): GlobalMouse

Get the global-mouse object.
Direct-access. No need to wait.

### navigator(): Navigator

Get the Navigator object.
Direct-access. No need to wait.

### frame(): Frame

Get the Frame object.
Direct-access. No need to wait.

### alert(): Alert

Get the Alert object.
Direct-access. No need to wait.
