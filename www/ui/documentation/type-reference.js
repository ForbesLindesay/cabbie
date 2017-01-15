import React from 'react';
import Match from 'react-router/Match';
import Link from '../link';
import styled from 'styled-components';

const TypeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`;
const TypeContainer = styled.span`
  color: #95a2ff;
`;
function TypeReference({type, isAsync}) {
  switch (type.type) {
    case 'class':
      return <TypeContainer><TypeLink to={'/api/classes/' + type.name.toLowerCase()}>{
        type.name
      }</TypeLink></TypeContainer>;
    case 'generic-type':
      if (!isAsync && type.id.type === 'builtin-type' && type.id.id === 'Promise' && type.typeParameters.length === 1) {
        return <TypeReference type={type.typeParameters[0]} isAsync={isAsync} />;
      }
      return (
        <TypeContainer><TypeReference type={type.id} isAsync={isAsync} />{'<'}{type.typeParameters.map((tp, i) => {
              return <span key={i}>{i !== 0 ? ', ' : ''}<TypeReference type={tp} isAsync={isAsync} /></span>;
            })}{'>'}</TypeContainer>
      );
    case 'builtin-type':
      return <TypeContainer>{type.id}</TypeContainer>;
    default:
      return <pre>{JSON.stringify(type)}</pre>;
  }
}

function TypeReferenceHandlingAsync(props) {
  return <Match pattern='/async' children={({matched}) => <TypeReference {...props} isAsync={matched} />} />;
}
export default TypeReferenceHandlingAsync;
