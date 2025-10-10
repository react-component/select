import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';

export default function SingleContent() {
  const { prefixCls, searchValue, displayValues } = useSelectInputContext();

  const displayValue = displayValues[0];

  return (
    <div className={`${prefixCls}-content`}>
      {displayValue ? displayValue.label : <Placeholder />}
      <Input value={searchValue} />
    </div>
  );
}
