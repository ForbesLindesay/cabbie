import type {TimeOutType} from './enums/time-out-types';
import type Driver from './driver';
import addDebugging from './add-debugging';
import url from "url";
import ms from "ms";
import BaseClass from './base-class';
import TimeOutTypes from './enums/time-out-types';

type TimeoutValue = number | string;

/**
 * Managing time-out
 */
class TimeOut extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/timeouts');
  }

  /**
   * Set a time-out
   */
  async setTimeOut(timeOutType: TimeOutType, ms: TimeoutValue): Promise<void> {
    switch (timeOutType) {
      case TimeOutTypes.SCRIPT:
        await this.setScriptTimeOut(ms);
        break;
      case TimeOutTypes.ASYNC_SCRIPT:
        await this.setAsyncScriptTimeOut(ms);
        break;
      case TimeOutTypes.PAGE_LOAD:
        await this.setPageLoadTimeOut(ms);
        break;
      case TimeOutTypes.IMPLICIT:
        await this.setImplicitTimeOut(ms);
        break;
      default:
        throw new Error(
          'Invalid timeout type ' + JSON.stringify(timeOutType) +
          ', expected "script", "page load", "implicit" or "async"'
        );
    }
  }

  /**
   * Set multiple time-outs at once
   */
  async setTimeOuts(timeOuts: {[key: TimeOutType]: TimeoutValue}): Promise<void> {
    for (const key of Object.keys(timeOuts)) {
      // $FlowFixMe: flow cannot tell that this key is in timeOuts
      await this.setTimeOut(key, timeOuts[key]);
    }
  }

  /**
   * Set the amount of time, in milliseconds, that scripts are permitted
   * to run before they are aborted and a "Timeout" error is returned to the client.
   */
  async setScriptTimeOut(timeout: TimeoutValue): Promise<void> {
    timeout = ms(timeout.toString());
    await this.requestJSON('POST', '', { type: TimeOutTypes.SCRIPT, ms: timeout });
  }

  /**
   * Set the amount of time, in milliseconds, that asynchronous scripts are permitted
   * to run before they are aborted and a "Timeout" error is returned to the client.
   */
  async setAsyncScriptTimeOut(timeout: TimeoutValue): Promise<void> {
    timeout = ms(timeout.toString());
    await this.requestJSON('POST', '/async_script', { ms: timeout });
  }

  /**
   * Set the amount of time, in milliseconds, that a page is permitted to be loaded
   * before they it is aborted and a "Timeout" error is returned to the client.
   */
  async setPageLoadTimeOut(timeout: TimeoutValue): Promise<void> {
    timeout = ms(timeout.toString());
    await this.requestJSON('POST', '', { type: TimeOutTypes.PAGE_LOAD, ms: timeout });
  }

  /**
   * Set the amount of time, in milliseconds, that scripts executed are permitted
   * to run before they are aborted and a "Timeout" error is returned to the client.
   */
  async setImplicitTimeOut(timeout: TimeoutValue): Promise<void> {
    timeout = ms(timeout.toString());
    await this.requestJSON('POST', '', { type: TimeOutTypes.IMPLICIT, ms: timeout });
  }
}
addDebugging(TimeOut);
export default TimeOut;
