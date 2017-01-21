import React from 'react';
import styled from 'styled-components';

const MinWidth = styled.span`
  display: none;
  @media(min-width: ${props => props.minWidth}px) {
    display: inline;
  }
`;
export default MinWidth;
