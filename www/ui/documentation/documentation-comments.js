import React from 'react';
import styled from 'styled-components';
import Link from '../link';
import Mode from '../mode';

function renderComment(comment, i) {
  return (
    <Mode
      key={i}
      async={<div dangerouslySetInnerHTML={{__html: comment.async}} />}
      sync={<div dangerouslySetInnerHTML={{__html: comment.sync}} />}
    />
  );
}
function DocumentationComments({comments}) {
  return (
    <div>
      {comments.map(renderComment)}
    </div>
  );
}
export default DocumentationComments;
