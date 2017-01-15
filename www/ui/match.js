import React from 'react';
import Match from 'react-router/Match';

function MatchHandlingAsync({pattern, ...props}) {
  return <Match pattern='/async' children={
    ({matched}) => <Match pattern={matched ? '/async' + pattern.replace(/\/$/, '') : pattern} {...props} />
  } />;
}
export default MatchHandlingAsync;
