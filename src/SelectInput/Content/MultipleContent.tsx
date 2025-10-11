import * as React from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';
import Overflow from 'rc-overflow';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import type { SharedContentProps } from '.';
import type { DisplayValueType, RawValueType } from '../../interface';
import type { RenderNode, CustomTagProps } from '../../BaseSelect';
import TransBtn from '../../TransBtn';
import { getTitle } from '../../utils/commonUtil';
import useLayoutEffect from '../../hooks/useLayoutEffect';
import useBaseProps from '../../hooks/useBaseProps';

function itemKey(value: DisplayValueType) {
  return value.key ?? value.value;
}

const onPreventMouseDown = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

export default React.forwardRef<HTMLInputElement, SharedContentProps>(function MultipleContent(
  { inputProps },
  ref,
) {
  const { prefixCls, displayValues, searchValue } = useSelectInputContext();
  const baseProps = useBaseProps();
  const { disabled, showSearch, open, toggleOpen } = baseProps;

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [focused, setFocused] = useState(false);

  // ===================== Search ======================
  const inputValue = showSearch ? searchValue : '';
  const inputEditable: boolean = showSearch && (open || focused);

  // We measure width and set to the input immediately
  useLayoutEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.scrollWidth);
    }
  }, [inputValue]);

  // These would typically come from parent props - using defaults for now
  const removeIcon: RenderNode = '×';
  const maxTagTextLength: number | undefined = undefined;
  const maxTagCount: number | 'responsive' | undefined = undefined;
  const maxTagPlaceholder = (omittedValues: DisplayValueType[]) => `+ ${omittedValues.length} ...`;
  const tagRender: ((props: CustomTagProps) => React.ReactElement) | undefined = undefined;

  const onToggleOpen = (newOpen?: boolean) => {
    toggleOpen(newOpen);
  };

  const onRemove = (value: DisplayValueType) => {
    // TODO: This should be connected to parent's remove logic
    console.log('Remove:', value);
  };

  // ======================== Item ========================
  // >>> Render Selector Node. Includes Item & Rest
  const defaultRenderSelector = (
    item: DisplayValueType,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable?: boolean,
    onClose?: React.MouseEventHandler,
  ) => (
    <span
      title={getTitle(item)}
      className={clsx(`${prefixCls}-item`, {
        [`${prefixCls}-item-disabled`]: itemDisabled,
      })}
    >
      <span className={`${prefixCls}-item-content`}>{content}</span>
      {closable && (
        <TransBtn
          className={`${prefixCls}-item-remove`}
          onMouseDown={onPreventMouseDown}
          onClick={onClose}
          customizeIcon={removeIcon}
        >
          ×
        </TransBtn>
      )}
    </span>
  );

  const customizeRenderSelector = (
    value: RawValueType,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable?: boolean,
    onClose?: React.MouseEventHandler,
    isMaxTag?: boolean,
    info?: { index: number },
  ) => {
    const onMouseDown = (e: React.MouseEvent) => {
      onPreventMouseDown(e);
      onToggleOpen(!open);
    };
    return (
      <span onMouseDown={onMouseDown}>
        {tagRender({
          label: content,
          value,
          index: info?.index,
          disabled: itemDisabled,
          closable,
          onClose,
          isMaxTag: !!isMaxTag,
        })}
      </span>
    );
  };

  // ======================= Input ========================
  // >>> Input Node
  const inputNode = (
    <div
      className={`${prefixCls}-search`}
      style={{ width: inputWidth }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <Input
        ref={ref}
        disabled={disabled}
        readOnly={!inputEditable}
        {...inputProps}
        value={String(inputValue || '')}
      />

      {/* Measure Node */}
      <span ref={measureRef} className={`${prefixCls}-search-mirror`} aria-hidden>
        {inputValue}&nbsp;
      </span>
    </div>
  );

  // ====================== Overflow ======================
  const renderItem = (valueItem: DisplayValueType, info: { index: number }) => {
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
      if (event) {
        event.stopPropagation();
      }
      onRemove(valueItem);
    };

    return typeof tagRender === 'function'
      ? customizeRenderSelector(
          value,
          displayLabel,
          itemDisabled,
          closable,
          onClose,
          undefined,
          info,
        )
      : defaultRenderSelector(valueItem, displayLabel, itemDisabled, closable, onClose);
  };

  const renderRest = (omittedValues: DisplayValueType[]) => {
    // https://github.com/ant-design/ant-design/issues/48930
    if (!displayValues.length) {
      return null;
    }
    const content =
      typeof maxTagPlaceholder === 'function'
        ? maxTagPlaceholder(omittedValues)
        : maxTagPlaceholder;
    return typeof tagRender === 'function'
      ? customizeRenderSelector(undefined, content, false, false, undefined, true)
      : defaultRenderSelector({ title: content }, content, false);
  };

  // ======================= Render =======================
  // return (
  //   // <div className={`${prefixCls}-content`}>
  //     {/* <Input ref={ref} {...inputProps} value={searchValue} /> */}

  //   // </div>
  // );

  return (
    <Overflow
      prefixCls={`${prefixCls}-content`}
      data={displayValues}
      renderItem={renderItem}
      renderRest={renderRest}
      suffix={inputNode}
      itemKey={itemKey}
      maxCount={maxTagCount}
    />
  );
});
