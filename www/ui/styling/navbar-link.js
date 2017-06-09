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
    padding: 0 5px;
    font-weight: 200;
    @media (min-width: 300px) {
      font-size: 3.5vw;
    }
    @media (min-width: 400px) {
      font-size: 3.9vw;
    }
    @media (min-width: 650px) {
      font-size: 1.5em;
      padding: 0 10px;
    }
  }
  .active-nav-link {
    background: #95a2ff;
    color: #000842;
  }
  @media(max-width: ${props => (props.minWidth || 1) - 1}px) {
    display: none;
  }
`;
function NavBarLink({exactly, logoLink, minWidth, ...props}) {
  if (logoLink) {
    return (
      <NavBarLinkContainer minWidth={minWidth}>
        <Link {...props} />
      </NavBarLinkContainer>
    );
  }
  return (
    <NavBarLinkContainer minWidth={minWidth}>
      <Link {...props} className="nav-link" activeClassName="active-nav-link" exactly={exactly === true} />
    </NavBarLinkContainer>
  );
}

export default NavBarLink;
