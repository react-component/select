import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';

// This is just a placeholder, do not code any logic here

export default function MultipleContent() {
  const { prefixCls, displayValues: value } = useSelectInputContext();

  // For multiple mode, we show all values as a comma-separated string
  const displayValue = value
    .map((v) => v.label?.toString() || v.value?.toString() || '')
    .join(', ');

  return (
    <div className={`${prefixCls}-content`}>
      <Input value={displayValue} />
    </div>
  );
}
