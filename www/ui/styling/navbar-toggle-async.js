import React from 'react';
import Link from 'react-router/Link';
import Match from 'react-router/Match';
import styled from 'styled-components';
import {NavBarLinkContainer} from './navbar-link';
import MinWidth from './min-width';

function NavBarLink(props) {
  return (
    <NavBarLinkContainer style={{float: 'right'}}>
      <Link {...props} className="nav-link" />
    </NavBarLinkContainer>
  );
}

function renderAsyncToggle({location: {pathname}}) {
  if (pathname.startsWith('/async')) {
    const syncPathname = pathname.replace(/^\/async\/?/, '/');
    return (
      <NavBarLink to={syncPathname}>
        Show Sync <MinWidth minWidth={700}>{' '}API</MinWidth>
      </NavBarLink>
    );
  } else {
    const asyncPathname = '/async' + pathname.replace(/\/$/, '');
    return <NavBarLink to={asyncPathname}>Show Async<MinWidth minWidth={700}>{' '}API</MinWidth></NavBarLink>;
  }
}
function NavBarToggleAsync() {
  return <Match pattern="/" children={renderAsyncToggle} />;
}
export default NavBarToggleAsync;
