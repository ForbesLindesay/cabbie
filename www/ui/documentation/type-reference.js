import React, {PropTypes} from 'react';
import Match from 'react-router/Match';
import Link from '../link';
import styled from 'styled-components';
import String from './string';

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
    case 'enum-value-type':
      return <TypeContainer><TypeLink to={'/api/enums'}>{type.enum.valueName}</TypeLink></TypeContainer>;
    case 'generic-type':
      if (!isAsync && type.id.type === 'builtin-type' && type.id.id === 'Promise' && type.typeParameters.length === 1) {
        return <TypeReference type={type.typeParameters[0]} isAsync={isAsync} />;
      }
      return (
        <span><TypeReference type={type.id} isAsync={isAsync} />{'<'}{type.typeParameters.map((tp, i) => {
              return <span key={i}>{i !== 0 ? ', ' : ''}<TypeReference type={tp} isAsync={isAsync} /></span>;
            })}{'>'}</span>
      );
    case 'builtin-type':
      return <TypeContainer>{type.id}</TypeContainer>;
    case 'string-literal':
      return <String>'{type.value}'</String>;
    case 'union': {
      const types = [];
      type.types.forEach((t, i) => {
        if (i !== 0) {
          types.push(' | ');
        }
        types.push(<TypeReference key={i} type={t} isAsync={isAsync} />);
      });
      return <span>{types}</span>;
    }
    default:
      return <pre>{JSON.stringify(type)}</pre>;
  }
}
TypeReference.propTypes = {type: PropTypes.object.isRequired, isAsync: PropTypes.bool.isRequired};

function TypeReferenceHandlingAsync(props) {
  return <Match pattern='/async' children={({matched}) => <TypeReference {...props} isAsync={matched} />} />;
}
TypeReferenceHandlingAsync.propTypes = {type: PropTypes.object.isRequired};
export default TypeReferenceHandlingAsync;
