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
`;

const Root = styled.div`
  height: 100%;
`;

function Application() {
  return (
    <Root>
      <NavBar>
        <NavBarItems>
          <NavBarLink to='/' logoLink={true}><Logo height='40' width='40' fill='#95a2ff' style={
            {margin: '10px 0'}
          } /></NavBarLink>
          <NavBarLink to='/' isActive={() => false}>Home</NavBarLink>
          <NavBarLink to='/getting-started'>Getting Started</NavBarLink>
          <NavBarLink to='/api'>API</NavBarLink>
          <NavBarToggleAsync />
        </NavBarItems>
      </NavBar>
      <Container>
        <Match exactly pattern='/' component={Home} />
        <Match pattern='/getting-started' component={GettingStarted} />
        <Match pattern='/api' component={Api} />
      </Container>
    </Root>
  );
}

export default Application;
