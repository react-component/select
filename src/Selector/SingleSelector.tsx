import * as React from 'react';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import Input from './Input';
import type { InnerSelectorProps } from '.';
import { getTitle } from '../utils/commonUtil';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement;
  activeValue: string;
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
    activeDescendantId,
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
    onInputBlur,
    title,
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
  const hasTextInput = mode !== 'combobox' && !open && !showSearch ? false : !!inputValue;

  // Get title of selection item
  const selectionTitle = title === undefined ? getTitle(item) : title;

  const placeholderNode = React.useMemo<React.ReactNode>(() => {
    if (item) {
      return null;
    }
    return (
      <span
        className={`${prefixCls}-selection-placeholder`}
        style={hasTextInput ? { visibility: 'hidden' } : undefined}
      >
        {placeholder}
      </span>
    );
  }, [item, hasTextInput, placeholder, prefixCls]);

  return (
    <span className={`${prefixCls}-selection-wrap`}>
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
          activeDescendantId={activeDescendantId}
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
          onBlur={onInputBlur}
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
          maxLength={combobox ? maxLength : undefined}
        />
      </span>

      {/* Display value */}
      {!combobox && item ? (
        <span
          className={`${prefixCls}-selection-item`}
          title={selectionTitle}
          // 当 Select 已经选中选项时，还需 selection 隐藏但留在原地占位
          // https://github.com/ant-design/ant-design/issues/27688
          // https://github.com/ant-design/ant-design/issues/41530
          style={hasTextInput ? { visibility: 'hidden' } : undefined}
        >
          {item.label}
        </span>
      ) : null}

      {/* Display placeholder */}
      {placeholderNode}
    </span>
  );
};

export default SingleSelector;
