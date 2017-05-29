import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerRouter, createServerRenderContext} from 'react-router';
import {ServerStyleSheet} from 'styled-components';
import Application from './';

function serverRender(url, clientURL) {
  // first create a context for <ServerRouter>, it's where we keep the
  // results of rendering for the second pass if necessary
  const context = createServerRenderContext();

  // render the first time
  const sheet = new ServerStyleSheet();
  let markup = renderToString(
    sheet.collectStyles(
      <ServerRouter location={url} context={context}>
        <Application />
      </ServerRouter>,
    ),
  );
  let styleTags = sheet.getStyleTags();

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
      const sheet = new ServerStyleSheet();
      markup = renderToString(
        sheet.collectStyles(
          <ServerRouter location={url} context={context}>
            <Application />
          </ServerRouter>,
        ),
      );
      styleTags = sheet.getStyleTags();
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
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <title>Cabbie</title>
  ${styleTags}
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
  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '403900059946166'); // Insert your pixel ID here.
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=403900059946166&ev=PageView&noscript=1"
  /></noscript>
  <!-- DO NOT MODIFY -->
  <!-- End Facebook Pixel Code -->
</body>
</html>`,
    };
  }
}
export default serverRender;
