import React from 'react';
import Heading from '../styling/heading';
import Mode from '../mode';
import documentation from '../../documentation';
import ModuleMethod from './module-method';

function Cabbie() {
  return (
    <div>
      <Mode sync={<Heading>cabbie-sync</Heading>} async={<Heading>cabbie-async</Heading>} />
      <p>
        Cabbie is a webdriver client. It allows can be used in both an asynchronous and asynchronous mode.
        The synchronous mode is much easier to use, however you may get slightly better performance from the
        asynchronous mode, especially if you are running many tests in parallel.
      </p>
      <p>
        Synchronous and asynchronous modes have almost identical APIs, but you can toggle the documentation between
        them using the button at the right hand end of the navbar.
      </p>
      {documentation.modules[0].methods.map(method => <ModuleMethod key={method.fun.id} method={method} />)}
    </div>
  );
}

export default Cabbie;
