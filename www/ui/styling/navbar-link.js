import React from 'react';
import Link from '../link';
import styled from 'styled-components';

export const NavBarLinkContainer = styled.li`
  float: left;
  height: 100%;
  display: inline-block;
  .nav-link {
    color: #95a2ff;
    display: inline-block;
    line-height: 60px;
    text-decoration: none;
    padding: 0 10px;
    font-size: 1.5em;
    font-weight: 200;
  }
  .active-nav-link {
    background: #95a2ff;
    color: #000842;
  }
`;
function NavBarLink({logoLink, ...props}) {
  if (logoLink) {
    return (
      <NavBarLinkContainer>
        <Link {...props} />
      </NavBarLinkContainer>
    );
  }
  return (
    <NavBarLinkContainer>
      <Link {...props} className='nav-link' activeClassName='active-nav-link' />
    </NavBarLinkContainer>
  );
}

export default NavBarLink;
