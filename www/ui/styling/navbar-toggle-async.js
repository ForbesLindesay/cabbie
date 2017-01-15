import React from 'react';
import Link from 'react-router/Link';
import Match from 'react-router/Match';
import styled from 'styled-components';
import {NavBarLinkContainer} from './navbar-link';

function NavBarLink(props) {
  return (
    <NavBarLinkContainer style={{float: 'right'}}>
      <Link {...props} className='nav-link' />
    </NavBarLinkContainer>
  );
}

function renderAsyncToggle({location: {pathname}}) {
  if (pathname.startsWith('/async')) {
    const syncPathname = pathname.replace(/^\/async\/?/, '/');
    return (
      <NavBarLink to={syncPathname}>
        Show Sync API
      </NavBarLink>
    );
  } else {
    const asyncPathname = '/async' + pathname.replace(/\/$/, '');
    return <NavBarLink to={asyncPathname}>Show Async API</NavBarLink>;
  }
}
function NavBarToggleAsync() {
  return <Match pattern='/' children={renderAsyncToggle} />;
}
export default NavBarToggleAsync;
