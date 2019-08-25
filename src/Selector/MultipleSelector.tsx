import React from 'react';
import classNames from 'classnames';
import CSSMotionList from 'rc-animate/lib/CSSMotionList';
import TransBtn from '../TransBtn';
import { LabelValueType, RawValueType } from '../interface/generator';
import { RenderNode } from '../interface';
import { InnerSelectorProps } from '.';
import Input from './Input';

const REST_TAG_KEY = '__RC_SELECT_MAX_REST_COUNT__';

interface SelectorProps extends InnerSelectorProps {
  multiple: boolean;

  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: (omittedValues: LabelValueType[]) => React.ReactNode;
  tokenSeparators?: string[];

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
  showSearch,
  autoFocus,
  accessibilityIndex,

  removeIcon,
  choiceTransitionName,

  maxTagCount,
  maxTagTextLength,
  maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,

  onSelect,
  onInputChange,
  onInputKeyDown,
}) => {
  const [motionAppear, setMotionAppear] = React.useState(false);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = React.useState(0);

  // ===================== Motion ======================
  React.useEffect(() => {
    setMotionAppear(true);
  }, []);

  // ===================== Search ======================
  const inputEditable: boolean = open && showSearch;

  // We measure width and set to the input immediately
  React.useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [searchValue]);

  // ==================== Selection ====================
  let displayValues: LabelValueType[] = values;

  // Filter display selection
  if (typeof maxTagCount === 'number') {
    const restCount = values.length - maxTagCount;

    displayValues = values.slice(0, maxTagCount);
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

    if (restCount) {
      displayValues.push({
        key: REST_TAG_KEY,
        label:
          typeof maxTagPlaceholder === 'function'
            ? maxTagPlaceholder(values.slice(maxTagCount))
            : maxTagPlaceholder,
      });
    }
  }

  const selectionNode = (
    <CSSMotionList
      component={React.Fragment}
      keys={displayValues}
      motionName={choiceTransitionName}
      motionAppear={motionAppear}
    >
      {({ key, label, value, className, style }) => {
        const mergedKey = key || value;

        return (
          <span
            key={mergedKey}
            className={classNames(`${prefixCls}-selection-item`, className)}
            style={style}
          >
            {label}
            {key !== REST_TAG_KEY && (
              <TransBtn
                className={`${prefixCls}-selection-item-remove`}
                onMouseDown={event => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={event => {
                  event.stopPropagation();
                  onSelect(value, { selected: false });
                }}
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
          prefixCls={prefixCls}
          id={id}
          inputElement={null}
          disabled={disabled}
          autoFocus={autoFocus}
          editable={inputEditable}
          accessibilityIndex={accessibilityIndex}
          value={searchValue}
          onKeyDown={onInputKeyDown}
          onChange={onInputChange}
        />

        {/* Measure Node */}
        <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
          {searchValue}&nbsp;
        </span>
      </span>

      {!values.length && !searchValue && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </>
  );
};

export default SelectSelector;
