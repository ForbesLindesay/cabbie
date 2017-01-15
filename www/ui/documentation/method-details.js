import React from 'react';
import TypeReference from './type-reference';

function MethodDetails({fun}) {
  const paramsList = [];
  fun.params.forEach(param => {
    paramsList.push(<dt key={param.name}>{param.name}</dt>);
    paramsList.push(<dd key={param.name + '_type'}><TypeReference type={param.typeAnnotation} /></dd>);
  });
  if (!fun.params.length) {
    return <div />;
  }
  return (
    <div>
      <dl>
        {paramsList}
      </dl>
    </div>
  );
}
export default MethodDetails;
