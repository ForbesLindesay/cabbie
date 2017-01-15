import React from 'react';
import Match from 'react-router/Match';
import Link from '../link';
import styled from 'styled-components';
import TypeReference from './type-reference';

function Parameter({param}) {
  // TODO: default value / optional values
  return <span>{param.name}{': '}<TypeReference type={param.typeAnnotation} /></span>;
}
export default Parameter;
