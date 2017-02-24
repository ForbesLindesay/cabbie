import React, {Component, PropTypes} from 'react';
import Router from 'react-router/BrowserRouter';
import styled, {injectGlobal} from 'styled-components';
import Match from './match';
import Home from './home';
import Container from './styling/container';
import NavBarItems from './styling/navbar-items';
import NavBarLink from './styling/navbar-link';
import NavBarToggleAsync from './styling/navbar-toggle-async';
import NavBar from './styling/navbar';
import MinWidth from './styling/min-width';
import Logo from './logo';
import GettingStarted from './getting-started';
import Api from './api';

injectGlobal`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
  * {
    box-sizing: border-box;
  }
  body {
    padding-top: 70px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    color: #000842;
  }
  #container {
    height: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    border-bottom: 2px solid #f1eff1;
  }
  td {
    border-bottom: 1px solid #f1eff1;
  }
  pre, code {
    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  }

  // atom-one-light
  .hljs{display:block;overflow-x:auto;padding:0.5em;color:#383a42;background:#fafafa}.hljs-comment,.hljs-quote{color:#a0a1a7;font-style:italic}.hljs-doctag,.hljs-keyword,.hljs-formula{color:#a626a4}.hljs-section,.hljs-name,.hljs-selector-tag,.hljs-deletion,.hljs-subst{color:#e45649}.hljs-literal{color:#0184bb}.hljs-string,.hljs-regexp,.hljs-addition,.hljs-attribute,.hljs-meta-string{color:#50a14f}.hljs-class .hljs-title{color:#c18401}.hljs-variable,.hljs-template-variable,.hljs-type,.hljs-selector-class,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-number{color:#986801}.hljs-symbol,.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-title{color:#4078f2}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}.hljs-link{text-decoration:underline}
`;

const Root = styled.div`
  height: 100%;
`;

function Application() {
  return (
    <Root>
      <NavBar>
        <NavBarItems>
          <NavBarLink to="/" logoLink={true}>
            <Logo height="40" width="40" fill="#95a2ff" style={{margin: '10px 10px 0 0'}} />
          </NavBarLink>
          <NavBarLink exactly to="/" minWidth={600}>Home</NavBarLink>
          <NavBarLink to="/getting-started">Get<MinWidth minWidth={450}>ting</MinWidth>{' '}Started</NavBarLink>
          <NavBarLink to="/api">API</NavBarLink>
          <NavBarToggleAsync />
        </NavBarItems>
      </NavBar>
      <Container>
        <Match pattern="/" component={Home} />
        <Match exactly={false} pattern="/getting-started" component={GettingStarted} />
        <Match exactly={false} pattern="/api" component={Api} />
      </Container>
    </Root>
  );
}

export default Application;
