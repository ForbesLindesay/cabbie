import React from 'react';
import DocumentationComments from './documentation-comments';
import String from './string';
import ImportDeclaration from './import-declaration';
import CodeBlock from './code-block';

function ClassType({classType}) {
  return <pre>{JSON.stringify(classType, null, '  ')}</pre>;
}

export default ClassType;
