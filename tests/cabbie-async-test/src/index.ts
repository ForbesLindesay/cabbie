import createCabbie, {startChromedriver} from 'cabbie-async';
import runTest from './runTest';
import startProxy, {ProxyMode} from 'record-replay-proxy';
import parseArgs, {Remote} from './parseArgs';
import uploadFixtures from './uploadFixtures';

(async () => {
  let killProxy = () => {};
  const args = parseArgs(process.argv.slice(2));
  const location = await uploadFixtures();
  if (args.proxyOptions) {
    killProxy = await startProxy(args.proxyOptions);
  }
  try {
    if (
      args.originalRemote === Remote.chromedriver &&
      (!args.proxyOptions || args.proxyOptions.mode === ProxyMode.Record)
    ) {
      console.log('starting chromedriver');
      startChromedriver();
    }
    const options = Object.assign(
      {debug: true, httpDebug: false},
      args.cabbieOptions,
    );
    console.log('creating driver');
    const driver = createCabbie(args.remote, options);
    try {
      await runTest(driver, location);
    } finally {
      await driver.dispose();
    }
  } finally {
    killProxy();
  }
})().then(
  () => {
    process.exit(0);
  },
  ex => {
    console.error(ex.stack || ex);
    process.exit(1);
  },
);
