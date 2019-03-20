import {resolve} from 'path';
import assertNever from 'assert-never';
import {ProxyOptions, ProxyMode} from 'record-replay-proxy';
import {statSync} from 'fs';
import {Options} from 'cabbie-async';

export enum Remote {
  chromedriver = 'chromedriver',
  taxirank = 'taxirank',
  saucelabs = 'saucelabs',
  selenium_hub = 'selenium-hub',
  proxy = 'http://localhost:1337',
}
function validateRemote(arg: string): Remote {
  const a = arg as Remote;
  switch (a) {
    case Remote.chromedriver:
    case Remote.taxirank:
    case Remote.saucelabs:
    case Remote.selenium_hub:
      return a;
    case Remote.proxy:
      throw new Error('Unsupported remote: proxy');
    default:
      return assertNever(a);
  }
}
function getOrigin(arg: Remote): string | null {
  switch (arg) {
    case Remote.chromedriver:
      return 'http://localhost:9515';
    case Remote.taxirank:
      return 'http://localhost:9516';
    case Remote.selenium_hub:
      return 'http://localhost:4444/wd/hub';
    case Remote.saucelabs:
      return null;
    case Remote.proxy:
      throw new Error('Unsupported remote: proxy');
    default:
      return assertNever(arg);
  }
}
function getProxyOptions(remote: Remote, args: string[]) {
  let proxyOptions: ProxyOptions | null = null;
  const record = args.indexOf('--record');
  const replay = args.indexOf('--replay');
  if (record !== -1 && replay !== -1) {
    throw new Error('Cannot use --record and --replay');
  }
  const index = Math.max(record, replay);
  if (index !== -1) {
    const url = getOrigin(remote);
    if (!url) {
      throw new Error(`${remote} does not support --record or --replay`);
    }
    const snapshotFile = args[index + 1];
    if (!snapshotFile || snapshotFile[0] === '-') {
      throw new Error(
        'Expected snapshot file name after --record or --replay arg',
      );
    }
    const resolvedSnapshotFile = resolve(snapshotFile);
    if (index === replay) {
      if (!statSync(resolvedSnapshotFile).isFile()) {
        throw new Error(`Expected ${snapshotFile} to be a file`);
      }
    }
    proxyOptions = {
      mode: index === record ? ProxyMode.Record : ProxyMode.Replay,
      destination: url,
      port: 1337,
      snapshotFile: resolvedSnapshotFile,
    };
  }
  return proxyOptions;
}
function getCabbieOptions(remote: Remote): Options {
  switch (remote) {
    case Remote.chromedriver:
    case Remote.taxirank:
      return {};
    case Remote.selenium_hub:
      return {capabilities: {browserName: 'chrome'}};
    case Remote.saucelabs:
      return {browser: {name: 'chrome'}};
    case Remote.proxy:
      throw new Error('Unsupported remote: proxy');
    default:
      return assertNever(remote);
  }
}
export default function parseArgs(args: string[]) {
  const remote = validateRemote(args[0]);
  const cabbieOptions = getCabbieOptions(remote);
  const proxyOptions = getProxyOptions(remote, args);

  return {
    originalRemote: remote,
    remote: proxyOptions ? Remote.proxy : remote,
    proxyOptions,
    cabbieOptions,
  };
}
