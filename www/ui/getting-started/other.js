import React from 'react';
import Heading from '../styling/heading';
import CodeBlock from '../documentation/code-block';
import Example from '../examples/other';

const dotenvExample = 'BROWSER_STACK_USERNAME={your browser stack username}\nBROWSER_STACK_ACCESS_KEY={your browser stack access key}';
function Documentation() {
  return (
    <div>
      <Heading>Other</Heading>
      <p>
        You can use your own selenium webdriver server. You will need to know the url of your
        webdriver server before you can get started.  If your webdriver server takes basic authentication,
        you can pass that in the url (e.g.<code>https://username:password@example.com</code>).
      </p>
      <Example />
    </div>
  );
}

export default Documentation;
