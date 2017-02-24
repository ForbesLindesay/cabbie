import React from 'react';
import Match from 'react-router/Match';

function MatchHandlingAsync({pattern, exactly, ...props}) {
  const children = ({matched, location}) => {
    const p = pattern.replace(/\/?$/, /\/$/.test(location.pathname) ? '/' : '');
    return <Match pattern={matched ? '/async' + p : p || '/'} exactly={exactly !== false} {...props} />;
  };
  return <Match pattern="/async" children={children} />;
}
export default MatchHandlingAsync;
