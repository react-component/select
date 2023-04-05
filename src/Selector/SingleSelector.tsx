import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
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

  // 当 Select 已经选中了选型时，placeholder 隐藏，但留在原地占位，内容是选中项文本，这样宽度不会缩减为 0px
  // https://github.com/ant-design/ant-design/issues/27688
  // https://github.com/ant-design/ant-design/issues/41530
  const renderPlaceholder = () => {
    const hiddenStyle = (hasTextInput || item)
      ? { visibility: 'hidden' } as React.CSSProperties : undefined;
    return (
      <span
        className={`${prefixCls}-selection-placeholder`}
        style={hiddenStyle}
      >
        {item ? item.label : placeholder}
      </span>
    );
  };

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
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
          maxLength={combobox ? maxLength : undefined}
        />
      </span>

      {/* Display value */}
      {!combobox && item && !hasTextInput && (
        <span className={`${prefixCls}-selection-item`} title={selectionTitle}>
          {item.label}
        </span>
      )}

      {/* Display placeholder */}
      {renderPlaceholder()}
    </>
  );
};

export default SingleSelector;
