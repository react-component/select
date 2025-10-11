import * as React from 'react';
import { useSelectInputContext } from './context';

export interface AffixProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'prefix' | 'suffix' | 'clear';
  children?: React.ReactNode;
}

export default function Affix(props: AffixProps) {
  const { type, children, ...restProps } = props;
  const { prefixCls } = useSelectInputContext();

  if (!children) {
    return null;
  }

  return (
    <div className={`${prefixCls}-${type}`} {...restProps}>
      {children}
    </div>
  );
}
