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
  tabIndex,

  showSearch,
  searchValue,
  activeValue,

  onInputKeyDown,
  onInputMouseDown,
  onInputChange,
}) => {
  const combobox = mode === 'combobox';
  const inputEditable = combobox || (showSearch && open);
  const item = values[0];

  const getDisplayValue = (value: React.ReactText): string => (value === null ? '' : String(value));
  let inputValue: string = searchValue;
  if (combobox) {
    inputValue = item ? getDisplayValue(item.value) : activeValue || searchValue;
  }

  // Not show text when closed expect combobox mode
  const hasTextInput = mode !== 'combobox' && !open ? false : !!inputValue;

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
          onMouseDown={onInputMouseDown}
          onChange={onInputChange}
          tabIndex={tabIndex}
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
