import React from 'react';
import styled from 'styled-components';
import CodeBlock from './code-block';
import DocumentationComments from './documentation-comments';
import ImportDeclaration from './import-declaration';
import Parameter from './parameter';
import TypeReference from './type-reference';
import MethodDetails from './method-details';

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
      <MethodDetails fun={method.fun} />
      <DocumentationComments comments={method.fun.leadingComments} />
    </section>
  );
}
export default ModuleMethod;
