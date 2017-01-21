import React from 'react';
import Match from './match';
import documentation from '../documentation';
import Cabbie from './documentation/cabbie';
import Enums from './documentation/enums';
import ClassType from './documentation/class-type';
import PageWithNavigation, {NavigationWrapper, ContentWrapper, SidebarLink} from './styling/page-with-navigation';

function Api() {
  return (
    <PageWithNavigation>
      <NavigationWrapper>
        <SidebarLink to='/api'>Cabbie</SidebarLink>
        <SidebarLink to='/api/enums'>Enums</SidebarLink>
        {documentation.classes.map(c => {
            return <SidebarLink key={c.name} to={'/api/classes/' + c.name.toLowerCase()}>{c.name}</SidebarLink>;
          })}
      </NavigationWrapper>
      <ContentWrapper>
        <Match pattern='/api' exactly component={Cabbie} />
        <Match pattern='/api/enums' exactly component={Enums} />
        <Match pattern='/api/classes/:className' exactly component={ClassType} />
      </ContentWrapper>
    </PageWithNavigation>
  );
}
export default Api;
