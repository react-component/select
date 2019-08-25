import React from 'react';
import Input from './Input';
import { InnerSelectorProps } from '.';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  combobox: boolean;
  activeValue: string;
  backfill?: boolean;
}

const SingleSelector: React.FC<SelectorProps> = ({
  inputElement,
  prefixCls,
  id,
  inputRef,
  disabled,
  autoFocus,
  accessibilityIndex,
  combobox,
  open,
  values,
  placeholder,

  showSearch,
  searchValue,
  activeValue,

  onInputKeyDown,
  onInputChange,
}) => {
  const inputEditable = combobox || (showSearch && open);
  const item = values[0];

  const hasTextInput = !!(combobox ? searchValue || activeValue : searchValue);
  const inputValue = combobox ? activeValue || searchValue : searchValue;

  return (
    <>
      <span className={`${prefixCls}-selection-search`}>
        <Input
          ref={inputRef}
          prefixCls={prefixCls}
          id={id}
          inputElement={inputElement}
          disabled={disabled}
          autoFocus={autoFocus}
          editable={inputEditable}
          accessibilityIndex={accessibilityIndex}
          value={inputValue}
          onKeyDown={onInputKeyDown}
          onChange={onInputChange}
        />
      </span>

      {/* Display value */}
      {!combobox && item && !hasTextInput && (
        <span className={`${prefixCls}-selection-item`}>{item.label}</span>
      )}

      {/* Display placeholder */}
      {!item && !hasTextInput && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SingleSelector;
