import React from 'react';
import styled from 'styled-components';
import Link from './link';
import Match from './match';
import Mode from './mode';
import documentation from '../documentation';
import TypeReference from './documentation/type-reference';
import Parameter from './documentation/parameter';
import DocumentationComments from './documentation/documentation-comments';

const ApiWrapper = styled.div`
  height: 100%;
  display: flex;
`;
const ApiNavigationWrapper = styled.nav`
  flex-basis: 220px;
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
const Keyword = styled.span`
  font-weight: 800;
`;
const String = styled.span`
  color: #ffc195;
`;
const Code = styled.code`
  font-size: 1.2em;
`;
function CodeBlock(props) {
  return <pre><Code {...props} /></pre>
}
function ModuleMethod({method}) {
  const name = method.fun.id;
  const params = method.fun.params.map(
    (param, i) => <span key={i}>{i !== 0 ? ', ' : ''}<Parameter param={param} /></span>,
  );
  const returnType = method.fun.returnType ? <span>{': '}<TypeReference type={method.fun.returnType} /></span> : '';
  const importName = method.key === 'default' ? name : '{' + method.key + '}';
  const moduleName = <Mode sync={<String>'cabbie-sync'</String>} async={<String>'cabbie-async'</String>} />
  return (
    <section>
      <MethodConatiner>{name}({params}){returnType}</MethodConatiner>
      <CodeBlock><Keyword>import</Keyword> {importName} <Keyword>from</Keyword> {moduleName};</CodeBlock>
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
      </ApiContentWrapper>
    </ApiWrapper>
  );
}
export default Api;
