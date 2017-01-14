import React from 'react';
import {renderToString} from 'react-dom/server';
import styled, {styleSheet} from 'styled-components';

const Heading = styled.h1`
  color: red;
`;

renderToString(<Heading>Hello World</Heading>);

console.log('run 1:');
console.dir(styleSheet.getCSS());

renderToString(<Heading>Hello World</Heading>);

console.log('run 2:');
console.dir(styleSheet.getCSS());
