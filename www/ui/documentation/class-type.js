import React from 'react';
import DocumentationComments from './documentation-comments';
import String from './string';
import ImportDeclaration from './import-declaration';
import CodeBlock from './code-block';

function ClassType({classType}) {
  return <section>
    <h1>{classType.name}</h1>
    <pre>{JSON.stringify(classType, null, '  ')}</pre>
  </section>;
}

export default ClassType;
