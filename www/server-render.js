import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerRouter, createServerRenderContext} from 'react-router';
import {styleSheet} from 'styled-components';
import Application from './ui';

function serverRender(url) {
  // first create a context for <ServerRouter>, it's where we keep the
  // results of rendering for the second pass if necessary
  const context = createServerRenderContext();

  // render the first time
  // styleSheet.reset();
  let markup = renderToString(
    <ServerRouter location={url} context={context}>
      <Application />
    </ServerRouter>,
  );
  let css = styleSheet.getCSS();

  // get the result
  const result = context.getResult();

  // the result will tell you if it redirected, if so, we ignore
  // the markup and send a proper redirect.
  if (result.redirect) {
    return {statusCode: 301, headers: {Location: result.redirect.pathname}};
  } else {
    // the result will tell you if there were any misses, if so
    // we can send a 404 and then do a second render pass with
    // the context to clue the <Miss> components into rendering
    // this time (on the client they know from componentDidMount)
    let statusCode = 200;
    if (result.missed) {
      statusCode = 404;
      // styleSheet.reset();
      markup = renderToString(
        <ServerRouter location={url} context={context}>
          <Application />
        </ServerRouter>,
      );
      css = styleSheet.getCSS();
    }
    return {
      statusCode,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cabbie</title>
  <style>${css}</style>
</head>
<body><div>${markup}</div></body>
</html>`,
    };
  }
}
export default serverRender;
