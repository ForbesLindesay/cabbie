import React from 'react';
import Link from 'react-router/Link';
import Match from 'react-router/Match';
import MatchWithAsync from './match';

function TRUE() {
  return true;
}
function FALSE() {
  return false;
}
function LinkHandlingAsync({to, exactly, ...props}) {
  const children = ({matched, location}) => {
    const p = to.replace(/\/?$/, /\/$/.test(location.pathname) ? '/' : '');
    const path = matched ? '/async' + p : p;
    if (exactly !== false) {
      return <Link {...props} to={path} isActive={path === location.pathname ? TRUE : FALSE} />;
    }
    return <Link {...props} to={path} />;
  };
  return <Match pattern="/async" children={children} />;
}
export default LinkHandlingAsync;
