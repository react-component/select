import * as React from 'react';
import clsx from 'clsx';
import { useSelectInputContext } from './context';

export interface AffixProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'prefix' | 'suffix' | 'clear';
  children?: React.ReactNode;
}

export default function Affix(props: AffixProps) {
  const { type, children, className, ...restProps } = props;
  const { prefixCls } = useSelectInputContext();

  if (!children) {
    return null;
  }

  return (
    <div className={clsx(`${prefixCls}-${type}`, className)} {...restProps}>
      {children}
    </div>
  );
}
