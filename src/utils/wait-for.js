import {startBufferingLogs, discardBufferedLogs, printBufferedLogs} from '../debug';
import autoSleep from './then-sleep';

// fool flow runtime checks
type T = any;
/**
 * Retry a function until it stops returning null/undefined, up to a default timeout of 5 seconds.
 */
export default (async function waitFor<T>(fn: () => Promise<T>, timeout: number = 5000): Promise<T> {
  const timeoutEnd = Date.now() + timeout;
  let count = 0;
  while (Date.now() < timeoutEnd) {
    try {
      startBufferingLogs();
      const value = await fn();
      if (value !== null && value !== undefined && (value: any) !== false) {
        printBufferedLogs();
        return value;
      }
    } catch (ex) {
      if (
        !(ex.code === 'NoSuchElement' ||
          ex.code === 'ElementNotVisible' ||
          ex.code === 'ElementIsNotSelectable' ||
          ex.code === 'NoAlertOpenError' ||
          ex.code === 'ERR_ASSERTION')
      ) {
        printBufferedLogs();
        throw ex;
      }
    }
    discardBufferedLogs();
    await autoSleep(count * 20);
    count++;
  }
  return fn();
});
