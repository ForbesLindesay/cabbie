import React from 'react';
import Match from './match';
import PageWithNavigation, {NavigationWrapper, ContentWrapper, SidebarLink} from './styling/page-with-navigation';
import BrowserStack from './getting-started/browserstack';
import Chromedriver from './getting-started/chromedriver';
import SauceLabs from './getting-started/saucelabs';
import TestingBot from './getting-started/testingbot';
import Other from './getting-started/other';

function GettingStarted() {
  return (
    <PageWithNavigation>
      <NavigationWrapper>
        <SidebarLink to="/getting-started">Chromedriver</SidebarLink>
        <SidebarLink to="/getting-started/browserstack">Browser Stack</SidebarLink>
        <SidebarLink to="/getting-started/saucelabs">Sauce Labs</SidebarLink>
        <SidebarLink to="/getting-started/testingbot">Testing Bot</SidebarLink>
        <SidebarLink to="/getting-started/other">Other</SidebarLink>
      </NavigationWrapper>
      <ContentWrapper>
        <Match pattern="/getting-started" component={Chromedriver} />
        <Match pattern="/getting-started/browserstack" exactly component={BrowserStack} />
        <Match pattern="/getting-started/saucelabs" exactly component={SauceLabs} />
        <Match pattern="/getting-started/testingbot" exactly component={TestingBot} />
        <Match pattern="/getting-started/other" exactly component={Other} />
      </ContentWrapper>
    </PageWithNavigation>
  );
}
export default GettingStarted;
