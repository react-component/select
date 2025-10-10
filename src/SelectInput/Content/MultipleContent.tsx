import * as React from 'react';
import Input from '../Input';
import type { DisplayValueType } from '../../../interface';

export interface MultipleContentProps {
  prefixCls: string;
  value: DisplayValueType[];
}

export default function MultipleContent(props: MultipleContentProps) {
  const { prefixCls, value } = props;

  // For multiple mode, we show all values as a comma-separated string
  const displayValue = value
    .map((v) => v.label?.toString() || v.value?.toString() || '')
    .join(', ');

  return (
    <div className={`${prefixCls}-content`}>
      <Input prefixCls={prefixCls} value={displayValue} />
    </div>
  );
}
