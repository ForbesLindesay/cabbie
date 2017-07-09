import {connect, createServer} from 'net';

function hookStream(stream, callback) {
  const oldWrite = stream.write;

  (stream: any).write = function() {
    oldWrite.apply(stream, arguments);
    callback.apply(null, arguments);
  };

  return () => {
    (stream: any).write = oldWrite;
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
    if (err.code === 'EADDRINUSE') {
      let client: any = null;
      client = connect(9517, 'localhost', () => {
        client.write('shutdown');
        client.on('data', () => {});
        client.on('end', () => {
          listen();
        });
      });
    } else {
      throw err;
    }
  });
  (server: any).listen(9517, () => {
    console.log('listening');
    const startServer = require('taxi-rank');
    startServer({
      port: 9516,
      onStart() {},
    });
  });
}
listen();
