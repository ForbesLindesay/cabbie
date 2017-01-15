import express from 'express';
import babelLive from 'babel-live';
import browserify from 'browserify-middleware';
import spawn from 'cross-spawn';

const cp = spawn(require.resolve('.bin/babel'), ['www/ui/', '--out-dir', 'output/www/ui', '--watch'], {
  stdio: 'inherit',
});
process.on('exit', () => cp.kill());

const app = express();

// N.B. we need to reset the style sheet
let serverRender;
let serverRenderHandle;

const now = Date.now();
const CLIENT_URL = '/static/' + now + '/client.js';
app.get(CLIENT_URL, browserify(__dirname + '/../output/www/ui/client.js'));
app.use((req, res, next) => {
  if (!serverRenderHandle) {
    serverRenderHandle = babelLive(
      __dirname + '/../output/www/ui/server-render.js',
      {},
      {babelrc: false},
      r => serverRender = r,
    );
  }
  serverRenderHandle.reRun();
  const result = serverRender.default(req.url, CLIENT_URL);
  console.dir(result);
  if (result.statusCode === 200 || result.statusCode === 404) {
    res.status(result.statusCode);
    res.send(result.html);
  } else {
    res.writeHead(result.statusCode, result.headers);
    res.end();
  }
});

export default app.listen(3000)
