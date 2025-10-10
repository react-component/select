import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';

export default function SingleContent() {
  const { prefixCls, displayValues: value } = useSelectInputContext();

  // For single mode, we only show the first value
  const displayValue = value[0]?.label?.toString() || value[0]?.value?.toString() || '';

  return (
    <div className={`${prefixCls}-content`}>
      <Input value={displayValue} />
      <Placeholder />
    </div>
  );
}
