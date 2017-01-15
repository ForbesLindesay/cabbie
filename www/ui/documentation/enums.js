import React from 'react';
import Heading from '../styling/heading';
import Mode from '../mode';
import documentation from '../../documentation';
import EnumType from './enum-type';

function Enums() {
  return (
    <div>
      <Heading>Enums</Heading>
      {documentation.enums.map(enumType => <EnumType key={enumType.name} enumType={enumType} />)}
    </div>
  );
}

export default Enums;
