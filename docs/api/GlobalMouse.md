# GlobalMouse

Global mouse object handling global mouse commands

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### moveTo(xOffset: Number, yOffset: Number)

Move the mouse by an offset relative to the current mouse cursor position

### click([button=Mouse.BUTTON_LEFT]: Number)

Click any mouse button at the current location of the mouse cursor

### clickAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Click any mouse button at an offset relative to the current location of the mouse cursor

### doubleClick()

Double-clicks at the current location of the mouse cursor

### buttonDown([button=Mouse.BUTTON_LEFT]: Number)

Click and hold the any mouse button at the current location of the mouse cursor

### buttonDownAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Click and hold the any mouse button relative to the current location of the mouse cursor

### buttonUp([button=Mouse.BUTTON_LEFT]: Number)

Releases the mouse button previously held at the current location of the mouse cursor

### buttonUpAt(xOffset: Number, yOffset: Number, [button=Mouse.BUTTON_LEFT]: Number)

Releases the mouse button previously held at the current location of the mouse cursor
