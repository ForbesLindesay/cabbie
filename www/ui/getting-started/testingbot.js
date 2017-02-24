import React from 'react';
import Heading from '../styling/heading';
import CodeBlock from '../documentation/code-block';
import Example from '../examples/testingbot';

const dotenvExample = 'TESTINGBOT_KEY={your testing bot key}\nTESTINGBOT_SECRET={your testing bot secret}';
function Documentation() {
  return (
    <div>
      <Heading>Testing Bot</Heading>
      <p>
        Testing Bot is a cloud provider.  It requires a monthly or yearly subscription, but offers free plans for
        open source projects.
      </p>
      <p>
        Start by signing up for an account at{' '}<a href="https://testingbot.com/">testingbot.com</a>,
        then set the following environment variables:
      </p>
      <dl>
        <dt>TESTINGBOT_KEY</dt>
        <dd>Your testing bot key.</dd>
        <dt>TESTINGBOT_SECRET</dt>
        <dd>Your testing bot secret.</dd>
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
