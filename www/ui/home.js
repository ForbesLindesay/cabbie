import React from 'react';
import Logo from './logo';
import Header from './styling/header';
import Heading from './styling/heading';

function Home() {
  return (
    <div>
      <Header>
        <Logo width='10vw' height='10vw' />
        <Heading>Cabbie</Heading>
      </Header>
    </div>
  );
}
export default Home;
