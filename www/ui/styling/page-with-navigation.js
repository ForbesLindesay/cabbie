import styled from 'styled-components';
import Link from '../link';

const PageWithNavigation = styled.div`
  @media(min-width: 1200px) {
    height: 100%;
    display: flex;
  }
`;
const NavigationWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  @media(min-width: 1200px) {
    display: block;
    flex-basis: 250px;
    overflow: auto;
    border-right: 1px solid #000842;
  }
`;
const ContentWrapper = styled.article`
  @media(min-width: 1200px) {
    overflow: auto;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    margin: 0 10px;
  }
`;

const SidebarLink = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: 100;
  color: #000842;
  font-size: 2em;
  margin-right: 1.2em;
  &.active-link {
    font-weight: 300;
    margin-right: 1em;
  }
  @media(min-width: 1200px) {
    margin-right: 0;
  }
`;
SidebarLink.defaultProps = {activeClassName: 'active-link'};

export {NavigationWrapper, ContentWrapper, SidebarLink};
export default PageWithNavigation;
