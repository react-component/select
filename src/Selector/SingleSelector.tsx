import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import classNames from 'classnames';
import Input from './Input';
import { InnerSelectorProps } from '.';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  activeValue: string;
  backfill?: boolean;
  searchValueIsSelectedLabel: boolean;
}

const SingleSelector: React.FC<SelectorProps> = props => {
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
    displayValues,
    placeholder,
    tabIndex,

    showSearch,
    searchValue,
    activeValue,

    onInputKeyDown,
    onInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,

    searchValueIsSelectedLabel,
  } = props;

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const inputEditable = combobox || showSearch;
  const displayValue = displayValues[0];

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
    displayValue && (typeof displayValue.label === 'string' || typeof displayValue.label === 'number')
      ? displayValue.label.toString()
      : undefined;

  const showSelectedOptionLabel = !combobox && displayValue && !hasTextInput;
  const showPlaceholder = !displayValue && !hasTextInput;
  const className = classNames(`${prefixCls}-selection-search`, {
    [`${prefixCls}-selection-search-is-selected-label`]: searchValueIsSelectedLabel,
  });

  return (
    <>
      <span className={className}>
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
          onChange={e => {
            setInputChanged(true);
            onInputChange(e as any);
          }}
          onPaste={onInputPaste}
          onCompositionStart={onInputCompositionStart}
          onCompositionEnd={onInputCompositionEnd}
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
        />
      </span>

      {/* Show the selected option's label */}
      {showSelectedOptionLabel && (
        <span className={`${prefixCls}-selection-item`} title={title}>
          {displayValue.label}
        </span>
      )}

      {/* Display placeholder */}
      {showPlaceholder && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SingleSelector;
