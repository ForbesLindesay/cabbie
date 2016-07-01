# Alert

Alert window management

Handles regular alerts, prompts, and confirms.

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### getText(): String

Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog

### setText(text: String)

Sends keystrokes to a JavaScript prompt() dialog

### accept()

Accepts the currently displayed alert dialog. Usually, this is equivalent to
clicking on the 'OK' button in the dialog.

### dismiss()

Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs,
this is equivalent to clicking the 'Cancel' button. For alert() dialogs, this is
equivalent to clicking the 'OK' button.

Note: Never use this with an alert. Use accept() instead.
