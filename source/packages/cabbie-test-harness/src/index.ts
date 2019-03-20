import startProxy, {ProxyMode, ProxyOptions} from 'record-replay-proxy';
import parseArgs, {Remote, CabbieOptions} from './parseArgs';
import uploadFixtures from './uploadFixtures';

export {CabbieOptions, Remote, ProxyOptions, ProxyMode};
export interface TestConfig {
  originalRemote: Remote;
  remote: Remote;
  cabbieOptions: CabbieOptions;
  location: string;
  proxyOptions: ProxyOptions | null;
}
export type RunTests = (testConfig: TestConfig) => Promise<void> | void;
export default function entrypoint(runTests: RunTests) {
  (async () => {
    let killProxy = () => {};
    const args = parseArgs(process.argv.slice(2));
    const location = await uploadFixtures();
    if (args.proxyOptions) {
      killProxy = await startProxy(args.proxyOptions);
    }
    try {
      const cabbieOptions = Object.assign(
        {debug: true, httpDebug: false},
        args.cabbieOptions,
      );
      await runTests({
        originalRemote: args.originalRemote,
        remote: args.remote,
        cabbieOptions,
        location,
        proxyOptions: args.proxyOptions,
      });
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
}
