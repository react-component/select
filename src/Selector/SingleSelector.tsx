import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Input from './Input';
import type { InnerSelectorProps } from '.';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  activeValue: string;
  backfill?: boolean;
}

const SingleSelector: React.FC<SelectorProps> = (props) => {
  const {
    inputElement,
    prefixCls,
    id,
    inputRef,
    disabled,
    autoFocus,
    autoComplete,
    accessibilityIndex,
    mode,
    open,
    values,
    placeholder,
    tabIndex,

    showSearch,
    searchValue,
    activeValue,
    maxLength,

    onInputKeyDown,
    onInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,
  } = props;

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const inputEditable = combobox || showSearch;
  const item = values[0];

  let inputValue: string = searchValue || '';
  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  // Not show text when closed expect combobox mode
  const hasTextInput = mode !== 'combobox' && !open ? false : !!inputValue;

  const title =
    item && (typeof item.label === 'string' || typeof item.label === 'number')
      ? item.label.toString()
      : undefined;

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
          autoComplete={autoComplete}
          editable={inputEditable}
          accessibilityIndex={accessibilityIndex}
          value={inputValue}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
          onChange={(e) => {
            setInputChanged(true);
            onInputChange(e as any);
          }}
          onPaste={onInputPaste}
          onCompositionStart={onInputCompositionStart}
          onCompositionEnd={onInputCompositionEnd}
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
          maxLength={combobox ? maxLength : undefined}
        />
      </span>

      {/* Display value */}
      {!combobox && item && !hasTextInput && (
        <span className={`${prefixCls}-selection-item`} title={title}>
          {item.label}
        </span>
      )}

      {/* Display placeholder */}
      {!item && !hasTextInput && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SingleSelector;
