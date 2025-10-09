import * as React from 'react';

export interface AffixProps {
  prefixCls: string;
  type: 'prefix' | 'suffix';
  children?: React.ReactNode;
}

export default function Affix(props: AffixProps) {
  const { prefixCls, type, children } = props;

  if (!children) {
    return null;
  }

  return <div className={`${prefixCls}-${type}`}>123</div>;
}
