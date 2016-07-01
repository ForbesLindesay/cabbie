# GlobalTouch

Global touch object handling global touch commands

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### down(x: Number, y: Number)

Finger down on the screen at the given position

### up(x: Number, y: Number)

Finger up on the screen at the given position

### move(x: Number, y: Number)

Move finger on the screen to the given position

### scroll(xOffset: Number, yOffset: Number)

Scroll on the touch screen using finger based motion events according to an offset

### flick(xSpeed: Number, ySpeed: Number)

Flick on the touch screen using finger motion events. This flick command starts at a particular screen location.
