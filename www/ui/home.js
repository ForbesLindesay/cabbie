import React from 'react';
import Logo from './logo';
import Header from './styling/header';
import Heading from './styling/heading';
import ChromedriverExample from './examples/chromedriver';

function Home() {
  return (
    <div>
      <Header>
        <Logo width='10vw' height='10vw' />
        <Heading>Cabbie</Heading>
      </Header>
      <div style={{margin: 'auto', maxWidth: 1000}}>
        <ChromedriverExample />
      </div>
    </div>
  );
}
export default Home;
