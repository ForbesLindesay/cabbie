import {connect, createServer} from 'net';
import {Writable} from 'stream';

const start = Date.now();

function hookStream(stream: Writable, callback: (d: any) => void) {
  const oldWrite = stream.write;

  stream.write = function(...args: any) {
    const result = oldWrite.apply(stream, args);
    callback.apply(null, args);
    return result;
  };

  return () => {
    (stream as any).write = oldWrite;
  };
}

function listen() {
  const server = createServer(c => {
    const stdout = hookStream(process.stdout, d => c.write(d));
    const stderr = hookStream(process.stderr, d => c.write(d));
    let buffer = '';
    c.on('data', d => {
      buffer += d.toString('utf8');
      if (buffer === 'shutdown') {
        process.exit(0);
      }
    });
    c.on('end', () => {
      stdout();
      stderr();
    });
  });
  server.on('error', err => {
    if ((err as any).code === 'EADDRINUSE' && Date.now() < start + 60 * 1000) {
      let client: any = null;
      client = connect(
        9517,
        'localhost',
        () => {
          const timeout = setTimeout(() => {
            throw err;
          }, 10000);
          client.write('shutdown');
          client.on('data', () => {});
          client.on('end', () => {
            clearTimeout(timeout);
            listen();
          });
        },
      );
    } else {
      throw err;
    }
  });
  (server as any).listen(9517, () => {
    console.log('listening');
    const startServer = require('taxi-rank');
    startServer({
      port: 9516,
      onStart() {},
    });
  });
}
listen();
