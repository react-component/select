import * as React from 'react';
import Input from '../Input';

export interface SingleContentProps {
  prefixCls: string;
}

export default function SingleContent(props: SingleContentProps) {
  const { prefixCls } = props;

  return (
    <div className={`${prefixCls}-content`}>
      <Input prefixCls={prefixCls} />
    </div>
  );
}
