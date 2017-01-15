import React from 'react';
import DocumentationComments from './documentation-comments';
import String from './string';
import ImportDeclaration from './import-declaration';
import CodeBlock from './code-block';

function EnumValue({enumType, enumValueName, enumValue}) {
  const value = enumValue.type === 'string-literal' ? <String>'{enumValue.value}'</String> : '' + enumValue.value;
  return (
    <tr>
      <td><code>{enumType.name}.{enumValueName}</code></td>
      <td>{value}</td>
      <td><DocumentationComments comments={enumValue.leadingComments} /></td>
    </tr>
  );
}
function EnumType({enumType}) {
  return (
    <div>
      <h2>{enumType.name}</h2>
      <CodeBlock>
        <ImportDeclaration local={enumType.valueName} isType={true} /><br />
        <ImportDeclaration local={enumType.name} isType={false} />
      </CodeBlock>
      <DocumentationComments comments={enumType.leadingComments} />
      <table>
        <thead>
          <tr>
            <th>Usage</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {
            Object
              .keys(enumType.values)
              .map(
                key => <EnumValue key={key} enumValueName={key} enumType={enumType} enumValue={enumType.values[key]} />,
              )
          }
        </tbody>
      </table>
    </div>
  );
  return <pre>{JSON.stringify(enumType, null, '  ')}</pre>;
}

export default EnumType;
