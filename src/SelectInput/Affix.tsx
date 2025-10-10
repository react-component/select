import * as React from 'react';
import { useSelectInputContext } from './context';

export interface AffixProps {
  type: 'prefix' | 'suffix' | 'clear';
  children?: React.ReactNode;
}

export default function Affix(props: AffixProps) {
  const { type, children } = props;
  const { prefixCls } = useSelectInputContext();

  if (!children) {
    return null;
  }

  return <div className={`${prefixCls}-${type}`}>{children}</div>;
}
