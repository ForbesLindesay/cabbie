/**
 * Managing session-storage
 */
class Frame extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/frame');
  }

  /**
   * Change focus to the default context on the page
   */
  activateDefault(): void {
    this.requestJSON('POST', '', { id: null });
  }

  /**
   * Change focus to a specific frame on the page
   */
  activate(id: string): void {
    this.requestJSON('POST', '', { id });
  }

  /**
   * Change focus to the parent context.  If the current context is the top level browsing context, the context remains unchanged.
   */
  activateParent(): void {
    this.requestJSON('POST', '/parent');
  }
}

export default Frame;