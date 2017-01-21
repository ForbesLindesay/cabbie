import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerRouter, createServerRenderContext} from 'react-router';
import {styleSheet} from 'styled-components';
import Application from './';

function serverRender(url, clientURL) {
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
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/manifest.json">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000842">
  <meta name="theme-color" content="#95a2ff">
  <meta property="og:image:width" content="279">
  <meta property="og:image:height" content="279">
  <meta property="og:title" content="CabbieJS">
  <meta property="og:description" content="Easy testing in real web browsers using node.js">
  <meta property="og:url" content="cabbiejs.org">
  <meta property="og:image" content="https://cabbiejs.org/og-image.jpg">
  <title>Cabbie</title>
  <style>${css}</style>
</head>
<body>
  <div id="container">${markup}</div>
  <script async defer src="${clientURL}"></script>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-31798041-8', 'auto');
    ga('send', 'pageview');
  </script>
</body>
</html>`,
    };
  }
}
export default serverRender;
