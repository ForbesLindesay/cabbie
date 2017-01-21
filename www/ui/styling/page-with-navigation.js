import styled from 'styled-components';
import Link from '../link';

const PageWithNavigation = styled.div`
  height: 100%;
  display: flex;
`;
const NavigationWrapper = styled.nav`
  flex-basis: 250px;
  overflow: auto;
  border-right: 1px solid #000842;
`;
const ContentWrapper = styled.article`
  overflow: auto;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  margin: 0 10px;
`;

const SidebarLink = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: 100;
  color: #000842;
  font-size: 2em;
  &.active-link {
    font-weight: 300;
  }
`;
SidebarLink.defaultProps = {activeClassName: 'active-link'};

export {NavigationWrapper, ContentWrapper, SidebarLink};
export default PageWithNavigation;
