import * as React from 'react';
import clsx from 'clsx';
import Affix from './Affix';
import SelectContent from './Content';
import SelectInputContext from './context';
import type { DisplayValueType } from '../interface';

export interface SelectInputProps {
  prefixCls: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearIcon?: React.ReactNode;
  multiple?: boolean;
  displayValues: DisplayValueType[];
  // Add other props that need to be passed through
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function SelectInput(props: SelectInputProps) {
  const {
    prefixCls,
    prefix,
    suffix,
    clearIcon,
    multiple,
    displayValues,
    className,
    style,
    ...restProps
  } = props;

  const cachedContext = React.useMemo(() => ({ prefixCls }), [prefixCls]);

  return (
    <SelectInputContext.Provider value={cachedContext}>
      <div className={clsx(className)} style={style} {...restProps}>
        {/* Prefix */}
        <Affix prefixCls={prefixCls} type="prefix">
          {prefix}
        </Affix>

        {/* Content */}
        <SelectContent prefixCls={prefixCls} multiple={multiple} value={displayValues} />

        {/* Suffix */}
        <Affix prefixCls={prefixCls} type="suffix">
          {suffix}
        </Affix>
        {/* Clear Icon */}
        {clearIcon && (
          <Affix prefixCls={prefixCls} type="clear">
            {clearIcon}
          </Affix>
        )}
      </div>
    </SelectInputContext.Provider>
  );
}
