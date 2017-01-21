import React from 'react';
import Heading from '../styling/heading';
import CodeBlock from '../documentation/code-block';
import Example from '../examples/saucelabs';

const dotenvExample = 'SAUCE_USERNAME={your sauce username}\nSAUCE_ACCESS_KEY={your sauce access key}';
function Documentation() {
  return (
    <div>
      <Heading>Sauce Labs</Heading>
      <p>
        Sauce labs is a cloud provider.  It requires a monthly or yearly subscription, but offers free plans for
        open source projects.
      </p>
      <p>
        Start by signing up for an account at{
          ' '
        }<a href='https://saucelabs.com/'>saucelabs.com</a>,
        then set the following environment variables:
      </p>
      <dl>
        <dt>SAUCE_USERNAME</dt>
        <dd>Your sauce labs username.</dd>
        <dt>SAUCE_ACCESS_KEY</dt>
        <dd>Your sauce labs access key.</dd>
      </dl>
      <p>
        To do this locally, you can create
        a{
          ' '
        }<a href='https://github.com/motdotla/dotenv'><code>.env</code></a>{
          ' '
        }file in your project's
        root directory:
      </p>
      <CodeBlock>{dotenvExample}</CodeBlock>
      <p>Then you can test using code like:</p>
      <Example />
    </div>
  );
}

export default Documentation;
