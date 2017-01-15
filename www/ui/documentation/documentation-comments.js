import React from 'react';
import Link from '../link';
import styled from 'styled-components';

function DocumentationComments({comments}) {
  const comment = comments.join('\n\n').replace(/^ *\* ?/gm, '');
  const elements = comment.split('\n\n').map((comment, i) => {
    return <p key={i}>{comment}</p>
  });
  return <div>{elements}</div>;
}
export default DocumentationComments;
