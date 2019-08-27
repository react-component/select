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
  let item = values[0];

  // '' is item value in combobox, but we should trade it as empty in display
  if (combobox && item && item.value === '') {
    item = null;
  }

  const hasTextInput = !!(combobox ? searchValue || activeValue : searchValue);
  const inputValue = combobox ? activeValue || searchValue : searchValue;

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
