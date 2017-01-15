import React from 'react';
import styled from 'styled-components';

const Code = styled.code`
  font-size: 1.2em;
`;
function CodeBlock(props) {
  return <pre><Code {...props} /></pre>;
}
export default CodeBlock;
