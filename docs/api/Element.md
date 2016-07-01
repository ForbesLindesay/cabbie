# Element

Object representing a DOM-Element

## Static Properties

### SELECTOR_CLASS: string

Class-name selector type

### SELECTOR_CSS: string

Css selector type, using the native css selector support

### SELECTOR_ID: string

Id selector type

### SELECTOR_NAME: string

Name selector type

### SELECTOR_LINK_TEXT: string

Link text selector type, finding a link that fits the selector.
The full link-text needs to match.

### SELECTOR_PARTIAL_LINK_TEXT: string

Partial-link text selector type, finding a link that partially fits the selector.
Only a part of the link-text needs to match.

### SELECTOR_TAG: string

Tag-name selector type

### SELECTOR_XPATH: string

XPath selector type

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### mouse(): Mouse

Get the mouse object.
Direct-access. No need to wait.

### touch(): Touch

Get the touch object.
Direct-access. No need to wait.

### elementId(): String

Get the value of the element id
Direct-access. No need to wait.

### elementHandler(): Object

Get the internal selenium handler object
Direct-access. No need to wait.

### getAttribute(attribute: String): String

Get the value of an attribute.

### hasClass(classStr: String): boolean

Does the element have a specific class?

### getText(): String

Get the text body of an element.

### getTagName(): String

Get the tag-name of an element.

### getCssValue(): String

Query the value of an element's computed CSS property. The CSS property to query
should be specified using the CSS property name, not the JavaScript property name
(e.g. background-color instead of backgroundColor).

### isDisplayed(): Boolean

Return true if the element is currently displayed on the page

### isSelected(): Boolean

Return true if the form element is selected

### isEqual(element: Element): Boolean

Return true if the current element is equal to the supplied element

### isEnabled(): Boolean

Return true if the form element is enabled

### isDisabled(): Boolean

Return true if the form element is disabled

### sendKeys(str: String | Array.<String>)

Type a string of characters into an input

### clear()

Clear the value of an input

### submit()

Submit a form element

### getSize(): Object

Get the size of an element

### getPosition(): Object

Get the position of an element

### getFrame(): Object

Get the frame of an element

### getAbsoluteCenter(): Object

Get the absolute center of an element

### getRelativeCenter(): Object

Get the relative center of an element

### getElement(selector: String, [selectorType='css: String): Element

Get an element via a selector.
Will throw an error if the element does not exist.

### getElements(selector: String, [selectorType='css: String): Array.<Element>

Get elements via a selector.

### hasElement(selector: String, [selectorType='css: String): boolean

Does a specific element exist?
