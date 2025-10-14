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
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useBaseProps from '../../hooks/useBaseProps';
import Placeholder from './Placeholder';

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
  const {
    prefixCls,
    displayValues,
    searchValue,
    onSelectorRemove,
    removeIcon: removeIconFromContext,

    focused,
  } = useSelectInputContext();
  const {
    disabled,
    showSearch,
    triggerOpen,
    toggleOpen,
    tagRender: tagRenderFromContext,
    maxTagPlaceholder: maxTagPlaceholderFromContext,
    maxTagTextLength,
    maxTagCount,
  } = useBaseProps();

  const selectionItemPrefixCls = `${prefixCls}-selection-item`;

  // ===================== Search ======================
  const inputValue = showSearch ? searchValue : '';
  const inputEditable: boolean = showSearch && !disabled;

  // Props from context with safe defaults
  const removeIcon: RenderNode = removeIconFromContext ?? '×';
  const maxTagPlaceholder:
    | React.ReactNode
    | ((omittedValues: DisplayValueType[]) => React.ReactNode) =
    maxTagPlaceholderFromContext ??
    ((omittedValues: DisplayValueType[]) => `+ ${omittedValues.length} ...`);
  const tagRender: ((props: CustomTagProps) => React.ReactElement) | undefined =
    tagRenderFromContext;

  const onToggleOpen = (newOpen?: boolean) => {
    toggleOpen(newOpen);
  };

  const onRemove = (value: DisplayValueType) => {
    onSelectorRemove?.(value);
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
      className={clsx(selectionItemPrefixCls, {
        [`${selectionItemPrefixCls}-disabled`]: itemDisabled,
      })}
    >
      <span className={`${selectionItemPrefixCls}-content`}>{content}</span>
      {closable && (
        <TransBtn
          className={`${selectionItemPrefixCls}-remove`}
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
      onToggleOpen(!triggerOpen);
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
  return (
    <>
      <Placeholder show={!searchValue || !triggerOpen} />
      <Overflow
        prefixCls={`${prefixCls}-content`}
        data={displayValues}
        renderItem={renderItem}
        renderRest={renderRest}
        // suffix={inputNode}
        suffix={
          <Input
            ref={ref}
            disabled={disabled}
            readOnly={!inputEditable}
            {...inputProps}
            value={inputValue || ''}
            syncWidth
          />
        }
        itemKey={itemKey}
        maxCount={maxTagCount}
      />
    </>
  );
});
