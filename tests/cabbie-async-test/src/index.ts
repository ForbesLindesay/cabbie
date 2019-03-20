import createCabbie, {startChromedriver} from 'cabbie-async';
import harness, {
  Remote,
  ProxyMode,
} from '../../../source/packages/cabbie-test-harness';
import runTest from './runTest';

harness(
  async ({originalRemote, proxyOptions, remote, cabbieOptions, location}) => {
    if (
      originalRemote === Remote.chromedriver &&
      (!proxyOptions || proxyOptions.mode === ProxyMode.Record)
    ) {
      console.log('starting chromedriver');
      startChromedriver();
    }
    console.log('creating driver');
    const driver = createCabbie(remote, cabbieOptions);
    try {
      await runTest(driver, location);
    } finally {
      await driver.dispose();
    }
  },
);
