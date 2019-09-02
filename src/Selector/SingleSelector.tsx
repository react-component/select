import React from 'react';
import Input from './Input';
import { InnerSelectorProps } from '.';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
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
  mode,
  open,
  values,
  placeholder,

  showSearch,
  searchValue,
  activeValue,

  onInputKeyDown,
  onInputChange,
}) => {
  const combobox = mode === 'combobox';
  const inputEditable = combobox || (showSearch && open);
  const item = values[0];

  let inputValue: string = searchValue;
  if (combobox) {
    inputValue = item ? String(item.value) : activeValue || searchValue;
  }

  const hasTextInput = !!inputValue;

  return (
    <>
      <span className={`${prefixCls}-selection-search`}>
        <Input
          ref={inputRef}
          prefixCls={prefixCls}
          id={id}
          open={open}
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
