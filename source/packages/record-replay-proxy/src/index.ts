import {fork} from 'child_process';

export enum ProxyMode {
  Record = 'Record',
  Replay = 'Replay',
}

export interface ProxyOptions {
  mode: ProxyMode;
  snapshotFile: string;
  destination: string | number;
  port: number;
}
const DEFAULT_REJECT = (err: Error): void => {
  throw err;
};
export default async function startProxy(options: ProxyOptions) {
  let reject = DEFAULT_REJECT;
  const destination =
    typeof options.destination === 'number'
      ? `http://localhost:${options.destination}`
      : options.destination;
  const proxy = fork(
    require.resolve('./proxy'),
    [options.mode, options.snapshotFile, destination, `${options.port}`],
    {stdio: ['inherit', 'inherit', 'inherit', 'ipc']},
  );

  process.on('exit', () => {
    proxy.kill();
  });
  proxy.unref();
  proxy.on('error', err => {
    reject(err);
  });
  proxy.on('exit', status => {
    if (status) {
      reject(new Error('proxy exited with non-zero status code'));
    }
  });
  await new Promise<void>((resolve, _reject) => {
    reject = _reject;
    proxy.on('message', message => {
      reject = DEFAULT_REJECT;
      if (message.status === 'started') {
        resolve();
      }
    });
  });
  return () => proxy.kill();
}
