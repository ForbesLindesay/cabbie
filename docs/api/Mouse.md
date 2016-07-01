# Mouse

Mouse commands relative to a DOM-element

## Static Properties

### BUTTON_LEFT: int

Left mouse button

### BUTTON_MIDDLE: int

Middle mouse button. It is the scroll button on some mouses.

### BUTTON_RIGHT: int

Right mouse button

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### click([button=Mouse.BUTTON_LEFT]: Number)

Click any mouse button at the center of the element

### clickAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Click any mouse button at a specified offset of the element

### moveTo(xOffset: Number, yOffset: Number)

Move the mouse by an offset of the element

### moveToCenter()

Move the mouse to the center of the element

### doubleClick()

Double-clicks the element at the center of the element

### doubleClickAt(xOffset: Number, yOffset: Number)

Double-clicks the element at a specified offset of the element

### buttonDown([button=Mouse.BUTTON_LEFT]: Number)

Click and hold any mouse button at the center of the element

### buttonDownAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Click and hold any mouse button at a specified offset of the element

### buttonUp([button=Mouse.BUTTON_LEFT]: Number)

Releases a mouse button at the center of the element

### buttonUpAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Releases a mouse button at a specified offset of the element
