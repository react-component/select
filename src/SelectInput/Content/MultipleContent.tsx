import * as React from 'react';
import Input from '../Input';

// NOTO: do not modify this file since it's just a placeholder for future use

export interface MultipleContentProps {
  prefixCls: string;
}

export default function MultipleContent(props: MultipleContentProps) {
  const { prefixCls } = props;

  return (
    <div className={`${prefixCls}-content`}>
      <Input prefixCls={prefixCls} />
    </div>
  );
}
