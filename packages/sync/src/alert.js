import BaseClass from './base-class';

class Alert extends BaseClass {

  /**
   * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog
   */
  getText(): string {
    return this.requestJSON('GET', '/alert_text');
  }

  /**
   * Sends keystrokes to a JavaScript prompt() dialog
   */
  setText(text: string): void {
    this.requestJSON('POST', '/alert_text', { text });
  }

  /**
   * Accepts the currently displayed alert dialog. Usually, this is equivalent to
   * clicking on the 'OK' button in the dialog.
   */
  accept(): void {
    this.requestJSON('POST', '/alert_text', { text });
  }

  /**
   * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs,
   * this is equivalent to clicking the 'Cancel' button. For alert() dialogs, this is
   * equivalent to clicking the 'OK' button.
   *
   * Note: Never use this with an alert. Use accept() instead.
   */
  dismiss(): void {
    this._requestJSON('POST', '/dismiss_alert');
  }
}