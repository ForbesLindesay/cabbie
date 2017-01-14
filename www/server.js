import express from 'express';
import babelLive from 'babel-live';
const app = express();

// N.B. we need to reset the style sheet
let serverRender;
const serverRenderHandle = babelLive(__dirname + '/server-render.js', {}, {}, r => serverRender = r);

app.use((req, res, next) => {
  serverRenderHandle.reRun();
  const result = serverRender.default(req.url);
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
