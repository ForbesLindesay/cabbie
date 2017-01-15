import React from 'react';
import Match from 'react-router/Match';

function Mode(props) {
  return <Match pattern='/async' children={({matched}) => matched ? props.async : props.sync} />;
}
export default Mode;
