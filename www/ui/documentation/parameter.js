import React from 'react';

function Parameter({param}) {
  // TODO: default value / optional values
  return <span>{param.name}{param.defaultValue ? '?' : ''}</span>;
}
export default Parameter;
