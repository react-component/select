import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Overflow from 'rc-overflow';
import TransBtn from '../TransBtn';
import type { InnerSelectorProps } from '.';
import Input from './Input';
import useLayoutEffect from '../hooks/useLayoutEffect';
import type { DisplayValueType, RenderNode, CustomTagProps, RawValueType } from '../BaseSelect';

function itemKey(value: DisplayValueType) {
  return value.key ?? value.value;
}

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: DisplayValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  onToggleOpen: (open?: boolean) => void;

  // Motion
  choiceTransitionName?: string;

  // Event
  onRemove: (value: DisplayValueType) => void;
}

const onPreventMouseDown = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};
const SelectSelector: React.FC<SelectorProps> = (props) => {
  const {
    id,
    prefixCls,

    values,
    open,
    searchValue,
    inputRef,
    placeholder,
    disabled,
    mode,
    showSearch,
    autoFocus,
    autoComplete,
    activeDescendantId,
    tabIndex,

    removeIcon,

    maxTagCount,
    maxTagTextLength,
    maxTagPlaceholder = (omittedValues: DisplayValueType[]) => `+ ${omittedValues.length} ...`,
    tagRender,
    onToggleOpen,

    onRemove,
    onInputChange,
    onInputPaste,
    onInputKeyDown,
    onInputMouseDown,
    onInputCompositionStart,
    onInputCompositionEnd,
  } = props;

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [focused, setFocused] = useState(false);

  const selectionPrefixCls = `${prefixCls}-selection`;

  // ===================== Search ======================
  const inputValue = open || mode === 'tags' ? searchValue : '';
  const inputEditable: boolean = mode === 'tags' || (showSearch && (open || focused));

  // We measure width and set to the input immediately
  useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [inputValue]);

  // ===================== Render ======================
  // >>> Render Selector Node. Includes Item & Rest
  function defaultRenderSelector(
    title: React.ReactNode,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable?: boolean,
    onClose?: React.MouseEventHandler,
  ) {
    return (
      <span
        className={classNames(`${selectionPrefixCls}-item`, {
          [`${selectionPrefixCls}-item-disabled`]: itemDisabled,
        })}
        title={
          typeof title === 'string' || typeof title === 'number' ? title.toString() : undefined
        }
      >
        <span className={`${selectionPrefixCls}-item-content`}>{content}</span>
        {closable && (
          <TransBtn
            className={`${selectionPrefixCls}-item-remove`}
            onMouseDown={onPreventMouseDown}
            onClick={onClose}
            customizeIcon={removeIcon}
          >
            ×
          </TransBtn>
        )}
      </span>
    );
  }

  function customizeRenderSelector(
    value: RawValueType,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable: boolean,
    onClose: React.MouseEventHandler,
  ) {
    const onMouseDown = (e: React.MouseEvent) => {
      onPreventMouseDown(e);
      onToggleOpen(!open);
    };

    return (
      <span onMouseDown={onMouseDown}>
        {tagRender({
          label: content,
          value,
          disabled: itemDisabled,
          closable,
          onClose,
        })}
      </span>
    );
  }

  function renderItem(valueItem: DisplayValueType) {
    const { disabled: itemDisabled, label, value } = valueItem;
    const closable = !disabled && !itemDisabled;

    let displayLabel: React.ReactNode = label;

    if (typeof maxTagTextLength === 'number') {
      if (typeof label === 'string' || typeof label === 'number') {
        const strLabel = String(displayLabel);

        if (strLabel.length > maxTagTextLength) {
          displayLabel = `${strLabel.slice(0, maxTagTextLength)}...`;
        }
      }
    }

    const onClose = (event?: React.MouseEvent) => {
      if (event) event.stopPropagation();
      onRemove(valueItem);
    };

    return typeof tagRender === 'function'
      ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose)
      : defaultRenderSelector(label, displayLabel, itemDisabled, closable, onClose);
  }

  function renderRest(omittedValues: DisplayValueType[]) {
    const content =
      typeof maxTagPlaceholder === 'function'
        ? maxTagPlaceholder(omittedValues)
        : maxTagPlaceholder;

    return defaultRenderSelector(content, content, false);
  }

  // >>> Input Node
  const inputNode = (
    <div
      className={`${selectionPrefixCls}-search`}
      style={{ width: inputWidth }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <Input
        ref={inputRef}
        open={open}
        prefixCls={prefixCls}
        id={id}
        inputElement={null}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        editable={inputEditable}
        activeDescendantId={activeDescendantId}
        value={inputValue}
        onKeyDown={onInputKeyDown}
        onMouseDown={onInputMouseDown}
        onChange={onInputChange}
        onPaste={onInputPaste}
        onCompositionStart={onInputCompositionStart}
        onCompositionEnd={onInputCompositionEnd}
        tabIndex={tabIndex}
        attrs={pickAttrs(props, true)}
      />

      {/* Measure Node */}
      <span ref={measureRef} className={`${selectionPrefixCls}-search-mirror`} aria-hidden>
        {inputValue}&nbsp;
      </span>
    </div>
  );

  // >>> Selections
  const selectionNode = (
    <Overflow
      prefixCls={`${selectionPrefixCls}-overflow`}
      data={values}
      renderItem={renderItem}
      renderRest={renderRest}
      suffix={inputNode}
      itemKey={itemKey}
      maxCount={maxTagCount}
    />
  );

  return (
    <>
      {selectionNode}

      {!values.length && !inputValue && (
        <span className={`${selectionPrefixCls}-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SelectSelector;
