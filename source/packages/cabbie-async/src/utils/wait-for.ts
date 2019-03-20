import {
  startBufferingLogs,
  discardBufferedLogs,
  printBufferedLogs,
} from '../debug';
import autoSleep from './then-sleep';

/**
 * Retry a function until it stops returning null/undefined, up to a default timeout of 5 seconds.
 */
export default (async function waitFor<T>(
  fn: () => Promise<T>,
  timeout: number = 5000,
): Promise<T> {
  const timeoutEnd = Date.now() + timeout;
  let count = 0;
  while (Date.now() < timeoutEnd) {
    try {
      startBufferingLogs();
      const value = await fn();
      if (value !== null && value !== undefined && (value as any) !== false) {
        printBufferedLogs();
        return value;
      }
    } catch (ex) {
      if (
        !(
          (ex as any).code === 'NoSuchElement' ||
          (ex as any).code === 'ElementNotVisible' ||
          (ex as any).code === 'ElementIsNotSelectable' ||
          (ex as any).code === 'NoAlertOpenError' ||
          (ex as any).code === 'ERR_ASSERTION'
        )
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
