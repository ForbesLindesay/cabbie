import React from 'react';
import Link from 'react-router/Link';
import Match from 'react-router/Match';

function LinkHandlingAsync({to, ...props}) {
  return <Match pattern='/async' children={
    ({matched}) => <Link {...props} to={matched ? '/async' + to.replace(/\/$/, '') : to} />
  } />;
}
export default LinkHandlingAsync;
