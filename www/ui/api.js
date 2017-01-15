import React from 'react';
import styled from 'styled-components';
import Link from './link';
import Match from './match';
import Mode from './mode';
import documentation from '../documentation';
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

const MethodConatiner = styled.h2`
  font-size: 1.7vw;
`;
function ModuleMethod({method}) {
  const name = method.fun.id;
  const params = method.fun.params.map(
    (param, i) => <span key={i}>{i !== 0 ? ', ' : ''}<Parameter param={param} /></span>,
  );
  const returnType = method.fun.returnType ? <span>{': '}<TypeReference type={method.fun.returnType} /></span> : '';
  return (
    <section>
      <MethodConatiner>{name}({params}){returnType}</MethodConatiner>
      <CodeBlock><ImportDeclaration local={name} exportKey={method.key} isType={false} /></CodeBlock>
      <DocumentationComments comments={method.fun.leadingComments} />
    </section>
  );
}
function Api() {
  return (
    <ApiWrapper>
      <ApiNavigationWrapper>
        <ApiNavSectionName to='/api' exactly>Cabbie</ApiNavSectionName>
        <ApiNavSectionName to='/api/enums'>Enums</ApiNavSectionName>
        <ul>
          {documentation.enums.map(enumType => {
              return <li key={enumType.name}>{enumType.name}</li>;
            })}
        </ul>
        {documentation.classes.map(c => {
            return <ApiNavSectionName key={c.name} to={
              '/api/classes/' + c.name.toLowerCase()
            }>{c.name}</ApiNavSectionName>;
          })}
      </ApiNavigationWrapper>
      <ApiContentWrapper>
        <Mode sync={<h1>cabbie-sync</h1>} async={<h1>cabbie-async</h1>} />
        <p>
          Cabbie is a webdriver client. It allows can be used in both an asynchronous and asynchronous mode.
          The synchronous mode is much easier to use, however you may get slightly better performance from the
          asynchronous mode, especially if you are running many tests in parallel.
        </p>
        <p>
          Synchronous and asynchronous modes have almost identical APIs, but you can toggle the documentation between
          them usin the button at the right hand end of the navbar.
        </p>
        {documentation.modules[0].methods.map(method => <ModuleMethod key={method.fun.id} method={method} />)}
        <h1>Enums</h1>
        {documentation.enums.map(enumType => <EnumType key={enumType.name} enumType={enumType} />)}
        {documentation.classes.map(classType => <ClassType key={classType.name} classType={classType} />)}
      </ApiContentWrapper>
    </ApiWrapper>
  );
}
export default Api;
