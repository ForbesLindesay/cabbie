// @flow

import createCabbie, { startChromedriver } from "cabbie-sync";
// $FlowFixMe
import harness, { Remote, ProxyMode } from '../../../source/packages/cabbie-test-harness';
import runTest from './runTest';
harness(({
  originalRemote,
  proxyOptions,
  remote,
  cabbieOptions,
  location
}) => {
  if (originalRemote === Remote.chromedriver && (!proxyOptions || proxyOptions.mode === ProxyMode.Record)) {
    console.log('starting chromedriver');
    startChromedriver();
  }

  console.log('creating driver');
  const driver = createCabbie(remote, cabbieOptions);

  try {
    runTest(driver, location);
  } finally {
    driver.dispose();
  }
});