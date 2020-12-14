import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import Overflow from 'rc-overflow';
import { CSSMotionList } from 'rc-motion';
import TransBtn from '../TransBtn';
import {
  LabelValueType,
  DisplayLabelValueType,
  RawValueType,
  CustomTagProps,
} from '../interface/generator';
import { RenderNode } from '../interface';
import { InnerSelectorProps } from '.';
import Input from './Input';
import useLayoutEffect from '../hooks/useLayoutEffect';

const REST_TAG_KEY = '__RC_SELECT_MAX_REST_COUNT__';

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;

  // Motion
  choiceTransitionName?: string;

  // Event
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
}

const SelectSelector: React.FC<SelectorProps> = props => {
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
    choiceTransitionName,

    maxTagCount,
    maxTagTextLength,
    maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
    tagRender,

    onSelect,
    onInputChange,
    onInputPaste,
    onInputKeyDown,
    onInputMouseDown,
    onInputCompositionStart,
    onInputCompositionEnd,
  } = props;

  const [motionAppear, setMotionAppear] = useState(false);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [focused, setFocused] = useState(false);

  const selectionPrefixCls = `${prefixCls}-selection`;

  // ===================== Motion ======================
  React.useEffect(() => {
    setMotionAppear(true);
  }, []);

  // ===================== Search ======================
  const inputValue = open || mode === 'tags' ? searchValue : '';
  const inputEditable: boolean = mode === 'tags' || (showSearch && (open || focused));

  // We measure width and set to the input immediately
  useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [inputValue]);

  // ==================== Selection ====================
  let displayValues: LabelValueType[] = values;

  // Cut by `maxTagCount`
  let restCount: number;
  if (typeof maxTagCount === 'number') {
    restCount = values.length - maxTagCount;
    displayValues = values.slice(0, maxTagCount);
  }

  // Update by `maxTagTextLength`
  if (typeof maxTagTextLength === 'number') {
    displayValues = displayValues.map(({ label, ...rest }) => {
      let displayLabel: React.ReactNode = label;

      if (typeof label === 'string' || typeof label === 'number') {
        const strLabel = String(displayLabel);

        if (strLabel.length > maxTagTextLength) {
          displayLabel = `${strLabel.slice(0, maxTagTextLength)}...`;
        }
      }

      return {
        ...rest,
        label: displayLabel,
      };
    });
  }

  // Fill rest
  if (restCount > 0) {
    displayValues.push({
      key: REST_TAG_KEY,
      label:
        typeof maxTagPlaceholder === 'function'
          ? maxTagPlaceholder(values.slice(maxTagCount as any))
          : maxTagPlaceholder,
    });
  }

  const selectionNode1 = (
    <CSSMotionList
      component={false}
      keys={displayValues as Required<LabelValueType>[]}
      motionName={choiceTransitionName}
      motionAppear={motionAppear}
    >
      {({ key, label, value, disabled: itemDisabled, className, style }) => {
        const mergedKey = key || value;
        const closable = !disabled && key !== REST_TAG_KEY && !itemDisabled;
        const onMouseDown = (event: React.MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
        };
        const onClose = (event?: React.MouseEvent) => {
          if (event) event.stopPropagation();
          onSelect(value, { selected: false });
        };

        return typeof tagRender === 'function' ? (
          <span key={mergedKey} onMouseDown={onMouseDown} className={className} style={style}>
            {tagRender({
              label,
              value,
              disabled: itemDisabled,
              closable,
              onClose,
            })}
          </span>
        ) : (
          <span
            key={mergedKey}
            className={classNames(className, `${selectionPrefixCls}-item`, {
              [`${selectionPrefixCls}-item-disabled`]: itemDisabled,
            })}
            style={style}
          >
            <span className={`${selectionPrefixCls}-item-content`}>{label}</span>
            {closable && (
              <TransBtn
                className={`${selectionPrefixCls}-item-remove`}
                onMouseDown={onMouseDown}
                onClick={onClose}
                customizeIcon={removeIcon}
              >
                ×
              </TransBtn>
            )}
          </span>
        );
      }}
    </CSSMotionList>
  );

  function renderSelectorNode(childNode: React.ReactNode, itemDisabled?: boolean) {
    if (typeof tagRender === 'function') {
      // TODO: handle this
    }

    return (
      <span
        className={classNames(`${selectionPrefixCls}-item`, {
          [`${selectionPrefixCls}-item-disabled`]: itemDisabled,
        })}
      >
        {childNode}
      </span>
    );
  }

  function renderItem(item: DisplayLabelValueType) {
    const { label, value, disabled: itemDisabled } = item;
    const closable = !disabled && !itemDisabled;

    const onMouseDown = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const onClose = (event?: React.MouseEvent) => {
      if (event) event.stopPropagation();
      onSelect(value, { selected: false });
    };

    return renderSelectorNode(
      <>
        <span className={`${selectionPrefixCls}-item-content`}>{label}</span>
        {closable && (
          <TransBtn
            className={`${selectionPrefixCls}-item-remove`}
            onMouseDown={onMouseDown}
            onClick={onClose}
            customizeIcon={removeIcon}
          >
            ×
          </TransBtn>
        )}
      </>,
      itemDisabled,
    );
  }

  function renderRest(omittedValues: DisplayLabelValueType[]) {
    return renderSelectorNode(
      typeof maxTagPlaceholder === 'function'
        ? maxTagPlaceholder(omittedValues)
        : maxTagPlaceholder,
    );
  }

  // ===================== Render ======================
  console.log('>>>', inputWidth);

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
