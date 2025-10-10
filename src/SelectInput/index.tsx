import * as React from 'react';
import clsx from 'clsx';
import Affix from './Affix';
import SelectContent from './Content';
import SelectInputContext from './context';
import type { DisplayValueType, Mode } from '../interface';

export interface SelectInputProps {
  prefixCls: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearIcon?: React.ReactNode;
  multiple?: boolean;
  displayValues: DisplayValueType[];
  placeholder?: React.ReactNode;
  searchValue?: string;
  mode?: Mode;
  open?: boolean;
  onSearch?: (searchText: string, fromTyping: boolean, isCompositing: boolean) => void;
  onSearchSubmit?: (searchText: string) => void;
  onInputBlur?: () => void;
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
    placeholder,
    searchValue,
    mode,
    open,
    onSearch,
    onSearchSubmit,
    onInputBlur,
    className,
    style,
    ...restProps
  } = props;

  const cachedContext = React.useMemo(
    () => ({
      prefixCls,
      multiple: !!multiple,
      displayValues,
      placeholder,
      searchValue,
      mode,
      open,
      onSearch,
      onSearchSubmit,
      onInputBlur,
    }),
    [
      prefixCls,
      multiple,
      displayValues,
      placeholder,
      searchValue,
      mode,
      open,
      onSearch,
      onSearchSubmit,
      onInputBlur,
    ],
  );

  return (
    <SelectInputContext.Provider value={cachedContext}>
      <div className={clsx(className)} style={style} {...restProps}>
        {/* Prefix */}
        <Affix type="prefix">{prefix}</Affix>

        {/* Content */}
        <SelectContent />

        {/* Suffix */}
        <Affix type="suffix">{suffix}</Affix>
        {/* Clear Icon */}
        {clearIcon && <Affix type="clear">{clearIcon}</Affix>}
      </div>
    </SelectInputContext.Provider>
  );
}
