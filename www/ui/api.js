import React from 'react';
import styled from 'styled-components';
import Link from './link';
import Match from './match';
import Mode from './mode';
import documentation from '../documentation';
import Cabbie from './documentation/cabbie';
import Enums from './documentation/enums';
import TypeReference from './documentation/type-reference';
import Parameter from './documentation/parameter';
import DocumentationComments from './documentation/documentation-comments';
import CodeBlock from './documentation/code-block';
import EnumType from './documentation/enum-type';
import String from './documentation/string';
import Keyword from './documentation/keyword';
import ImportDeclaration from './documentation/import-declaration';
import ClassType from './documentation/class-type';

const ApiWrapper = styled.div`
  height: 100%;
  display: flex;
`;
const ApiNavigationWrapper = styled.nav`
  flex-basis: 250px;
  overflow: auto;
  border-right: 1px solid #000842;
`;
const ApiContentWrapper = styled.article`
  overflow: auto;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  margin: 0 10px;
`;
const ApiNavSectionName = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: 100;
  color: #000842;
  font-size: 2em;
  &.active-link {
    font-weight: 300;
  }
`;
ApiNavSectionName.defaultProps = {activeClassName: 'active-link'};

function Api() {
  return (
    <ApiWrapper>
      <ApiNavigationWrapper>
        <Match pattern='/api' exactly children={
          ({matched}) => <ApiNavSectionName to='/api' isActive={() => matched}>Cabbie</ApiNavSectionName>
        } />
        <ApiNavSectionName to='/api/enums'>Enums</ApiNavSectionName>
        {documentation.classes.map(c => {
            return <ApiNavSectionName key={c.name} to={
              '/api/classes/' + c.name.toLowerCase()
            }>{c.name}</ApiNavSectionName>;
          })}
      </ApiNavigationWrapper>
      <ApiContentWrapper>
        <Match pattern='/api' exactly component={Cabbie} />
        <Match pattern='/api/enums' exactly component={Enums} />
        <Match pattern='/api/classes/:className' exactly component={ClassType} />
      </ApiContentWrapper>
    </ApiWrapper>
  );
}
export default Api;
