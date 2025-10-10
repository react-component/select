import * as React from 'react';
import Input from '../Input';
import type { DisplayValueType } from '../../interface';

export interface SingleContentProps {
  prefixCls: string;
  value: DisplayValueType[];
}

export default function SingleContent(props: SingleContentProps) {
  const { prefixCls, value } = props;

  // For single mode, we only show the first value
  const displayValue = value[0]?.label?.toString() || value[0]?.value?.toString() || '';

  return (
    <div className={`${prefixCls}-content`}>
      <Input prefixCls={prefixCls} value={displayValue} />
    </div>
  );
}
