import React from 'react';
import Heading from '../styling/heading';
import CodeBlock from '../documentation/code-block';
import Example from '../examples/browserstack';

const dotenvExample = 'BROWSER_STACK_USERNAME={your browser stack username}\nBROWSER_STACK_ACCESS_KEY={your browser stack access key}';
function Documentation() {
  return (
    <div>
      <Heading>Browser Stack</Heading>
      <p>
        Browser Stack is a cloud provider.  It requires a monthly or yearly subscription, but offers free plans for
        open source projects.
      </p>
      <p>
        Start by signing up for an account at{' '}<a href="https://www.browserstack.com/">browserstack.com</a>,
        then set the following environment variables:
      </p>
      <dl>
        <dt>BROWSER_STACK_USERNAME</dt>
        <dd>Your browser stack username.</dd>
        <dt>BROWSER_STACK_ACCESS_KEY</dt>
        <dd>Your browser statck access key.</dd>
      </dl>
      <p>
        To do this locally, you can create
        a{' '}<a href="https://github.com/motdotla/dotenv"><code>.env</code></a>{' '}file in your project's
        root directory:
      </p>
      <CodeBlock>{dotenvExample}</CodeBlock>
      <p>Then you can test using code like:</p>
      <Example />
    </div>
  );
}

export default Documentation;
