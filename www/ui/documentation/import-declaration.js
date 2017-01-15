import React from 'react';
import Keyword from './keyword';
import String from './string';
import Mode from '../mode';

function ImportSpecifier({local, exportKey}) {
  if (exportKey === 'default') {
    return <span>{local}</span>;
  }
  if (exportKey === local) {
    return <span>{'{' + local + '}'}</span>;
  }
  return <span>{'{' + exportKey}<Keyword>as</Keyword>{local + '}'}</span>;
}
function ImportDeclaration({local, exportKey, isType}) {
  const importSpecifier = <ImportSpecifier local={local} exportKey={exportKey || local} />;
  const moduleName = <Mode sync={<String>'cabbie-sync'</String>} async={<String>'cabbie-async'</String>} />;
  const type = isType ? <span><Keyword>type</Keyword></span> : '';
  return <span><Keyword>import</Keyword>{type}{importSpecifier}<Keyword>from</Keyword>{moduleName};</span>;
}
export default ImportDeclaration;
