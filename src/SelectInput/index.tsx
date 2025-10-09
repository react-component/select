import * as React from 'react';
import clsx from 'clsx';
import Affix from './Affix';

export interface SelectInputProps {
  prefixCls: string;
  // Add other props that need to be passed through
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function SelectInput(props: SelectInputProps) {
  const { prefixCls, className, style, ...restProps } = props;

  return (
    <div className={className} style={style} {...restProps}>
      {/* Prefix */}
      <Affix prefixCls={prefixCls} type="prefix" />
      2333
      {/* Suffix */}
      <Affix prefixCls={prefixCls} type="suffix" />
    </div>
  );
}
