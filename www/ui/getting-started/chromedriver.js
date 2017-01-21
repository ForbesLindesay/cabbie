import React from 'react';
import Heading from '../styling/heading';
import CodeBlock from '../documentation/code-block';
import Example from '../examples/chromedriver';

function Documentation() {
  return (
    <div>
      <Heading>Chromedriver</Heading>
      <p>
        Chromedriver is probably the easiest way to get up and running locally.  It's also conveniently free.
        This doesn't work well in headless environments (like CI servers), but is a great way to do a quick check
        of your tests in a local browser, where you can see everything that's going on.
      </p>
      <p>Start by installing chromedriver:</p>
      <CodeBlock>npm install chromedriver --save-dev</CodeBlock>
      <p>Then you can test using code like:</p>
      <Example />
    </div>
  );
}

export default Documentation;
