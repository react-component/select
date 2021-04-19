import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Overflow from 'rc-overflow';
import TransBtn from '../TransBtn';
import type {
  LabelValueType,
  DisplayLabelValueType,
  RawValueType,
  CustomTagProps,
  DefaultValueType,
} from '../interface/generator';
import type { RenderNode } from '../interface';
import type { InnerSelectorProps } from '.';
import Input from './Input';
import useLayoutEffect from '../hooks/useLayoutEffect';

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  onToggleOpen: (open?: boolean) => void;

  // Motion
  choiceTransitionName?: string;

  // Event
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
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
    accessibilityIndex,
    tabIndex,

    removeIcon,

    maxTagCount,
    maxTagTextLength,
    maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
    tagRender,
    onToggleOpen,

    onSelect,
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
    value: DefaultValueType,
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

  function renderItem({ disabled: itemDisabled, label, value }: DisplayLabelValueType) {
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
      onSelect(value, { selected: false });
    };

    return typeof tagRender === 'function'
      ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose)
      : defaultRenderSelector(displayLabel, itemDisabled, closable, onClose);
  }

  function renderRest(omittedValues: DisplayLabelValueType[]) {
    const content =
      typeof maxTagPlaceholder === 'function'
        ? maxTagPlaceholder(omittedValues)
        : maxTagPlaceholder;

    return defaultRenderSelector(content, false);
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
        accessibilityIndex={accessibilityIndex}
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
      itemKey="key"
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
