import React from 'react';
import classNames from 'classnames';
import CSSMotionList from 'rc-animate/lib/CSSMotionList';
import TransBtn from '../TransBtn';
import { LabelValueType, RawValueType, CustomTagProps } from '../interface/generator';
import { RenderNode } from '../interface';
import { InnerSelectorProps } from '.';
import Input from './Input';
import useLayoutEffect from '../hooks/useLayoutEffect';

const REST_TAG_KEY = '__RC_SELECT_MAX_REST_COUNT__';

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;

  // Motion
  choiceTransitionName?: string;

  // Event
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
}

const SelectSelector: React.FC<SelectorProps> = ({
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
  onInputKeyDown,
  onInputMouseDown,
}) => {
  const [motionAppear, setMotionAppear] = React.useState(false);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = React.useState(0);

  // ===================== Motion ======================
  React.useEffect(() => {
    setMotionAppear(true);
  }, []);

  // ===================== Search ======================
  const inputValue = open ? searchValue : '';
  const inputEditable: boolean = mode === 'tags' || (open && showSearch);

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
          ? maxTagPlaceholder(values.slice(maxTagCount))
          : maxTagPlaceholder,
    });
  }

  const selectionNode = (
    <CSSMotionList
      component={false}
      keys={displayValues}
      motionName={choiceTransitionName}
      motionAppear={motionAppear}
    >
      {({ key, label, value, disabled: itemDisabled, className, style }) => {
        const mergedKey = key || value;
        const closable = key !== REST_TAG_KEY && !itemDisabled;
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
            className={classNames(className, `${prefixCls}-selection-item`, {
              [`${prefixCls}-selection-item-disabled`]: itemDisabled,
            })}
            style={style}
          >
            <span className={`${prefixCls}-selection-item-content`}>{label}</span>
            {closable && (
              <TransBtn
                className={`${prefixCls}-selection-item-remove`}
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

  return (
    <>
      {selectionNode}

      <span className={`${prefixCls}-selection-search`} style={{ width: inputWidth }}>
        <Input
          ref={inputRef}
          open={open}
          prefixCls={prefixCls}
          id={id}
          inputElement={null}
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

        {/* Measure Node */}
        <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
          {inputValue}&nbsp;
        </span>
      </span>

      {!values.length && !inputValue && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SelectSelector;
