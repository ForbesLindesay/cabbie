export type TimeOutType = 'script' | 'async' | 'page load' | 'implicit';
const TimeOutTypeEnum = {
  /**
   * Synchronous script execution timeout
   */
  SCRIPT: ('script': 'script'),

  /**
   * Asynchronous script execution timeout
   */
  ASYNC_SCRIPT: ('async': 'async'),

  /**
   * Page load timeout
   */
  PAGE_LOAD: ('page load': 'page load'),

  /**
   * Implicit wait timeout.
   * Implicit waits are applied for all requests.
   */
  IMPLICIT: ('implicit': 'implicit')
};