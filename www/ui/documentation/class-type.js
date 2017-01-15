import assert from 'assert';
import React from 'react';
import Heading from '../styling/heading';
import documentation from '../../documentation';
import DocumentationComments from './documentation-comments';
import String from './string';
import ImportDeclaration from './import-declaration';
import CodeBlock from './code-block';
import TypeReference from './type-reference';
import MethodDetails from './method-details';
import Parameter from './parameter';

function Property({prop}) {
  const typeAnnotation = prop.typeAnnotation ? <span>{': '}{<TypeReference type={prop.typeAnnotation} />}</span> : null;
  return (
    <div>
      <h3>{prop.key}{typeAnnotation}</h3>
      <DocumentationComments comments={prop.leadingComments} />
    </div>
  );
}
function Method({method}) {
  const params = method.params.map((param, i) => <span key={i}>{i !== 0 ? ', ' : ''}<Parameter param={param} /></span>);
  return (
    <div>
      <h3>{method.key}({params}){': '}{method.returnType ? <TypeReference type={method.returnType} /> : 'void'}</h3>
      <MethodDetails fun={method} />
      <DocumentationComments comments={method.leadingComments} />
    </div>
  );
}

function ClassType({params: {className}}) {
  const classType = documentation.classes.filter(cls => cls.name.toLowerCase() === className)[0];
  assert.equal(classType.staticProperties.length, 0);
  assert.equal(classType.staticMethods.length, 0);
  return (
    <section>
      <Heading>{classType.name}</Heading>
      <CodeBlock>
        <ImportDeclaration local={classType.name} isType={false} />
      </CodeBlock>
      <h2>Properties</h2>
      {classType.properties.map(prop => <Property key={prop.key} prop={prop} />)}
      <h2>Methods</h2>
      {classType.methods.map(method => <Method key={method.key} method={method} />)}
    </section>
  );
}

export default ClassType;
