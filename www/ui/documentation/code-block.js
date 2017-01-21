import React from 'react';
import styled from 'styled-components';

const Pre = styled.pre`
  overflow-x: auto;
`;
const Code = styled.code`
  font-size: 1em;
  @media(min-width: 1200px) {
    font-size: 1.3vw;
  }
  @media(min-width: 1550px) {
    font-size: 1.35em;
  }
`;
function CodeBlock(props) {
  return <Pre><Code {...props} /></Pre>;
}
export default CodeBlock;
