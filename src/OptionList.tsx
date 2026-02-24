import { clsx } from 'clsx';
import KeyCode from '@rc-component/util/lib/KeyCode';
import useMemo from '@rc-component/util/lib/hooks/useMemo';
import omit from '@rc-component/util/lib/omit';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import type { ListRef } from '@rc-component/virtual-list';
import List from '@rc-component/virtual-list';
import type { ScrollConfig } from '@rc-component/virtual-list/lib/List';
import * as React from 'react';
import { useEffect } from 'react';
import type { BaseOptionType, RawValueType } from './Select';
import SelectContext from './SelectContext';
import TransBtn from './TransBtn';
import useBaseProps from './hooks/useBaseProps';
import type { FlattenOptionData } from './interface';
import { isPlatformMac } from './utils/platformUtil';
import { isValidCount } from './utils/valueUtil';

// export interface OptionListProps<OptionsType extends object[]> {
export type OptionListProps = Record<string, never>;

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (args: number | ScrollConfig) => void;
}

function isTitleType(content: any) {
  return typeof content === 'string' || typeof content === 'number';
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.ForwardRefRenderFunction<RefOptionListProps, {}> = (_, ref) => {
  const {
    prefixCls,
    id,
    open,
    multiple,
    mode,
    searchValue,
    toggleOpen,
    notFoundContent,
    onPopupScroll,
    showScrollBar,
    lockOptions,
  } = useBaseProps();
  const {
    maxCount,
    flattenOptions,
    onActiveValue,
    defaultActiveFirstOption,
    onSelect,
    menuItemSelectedIcon,
    rawValues,
    fieldNames,
    virtual,
    direction,
    listHeight,
    listItemHeight,
    optionRender,
    classNames: contextClassNames,
    styles: contextStyles,
  } = React.useContext(SelectContext);

  const itemPrefixCls = `${prefixCls}-item`;

  const memoFlattenOptions = useMemo(
    () => flattenOptions,
    [open, lockOptions],
    (prev, next) => next[0] && !next[1],
  );

  // =========================== List ===========================
  const listRef = React.useRef<ListRef>(null);

  const overMaxCount = React.useMemo<boolean>(
    () => multiple && isValidCount(maxCount) && rawValues?.size >= maxCount,
    [multiple, maxCount, rawValues?.size],
  );

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const scrollIntoView = (args: number | ScrollConfig) => {
    listRef.current?.scrollTo(typeof args === 'number' ? { index: args } : args);
  };

  // https://github.com/ant-design/ant-design/issues/34975
  const isSelected = React.useCallback(
    (value: RawValueType) => {
      if (mode === 'combobox') {
        return false;
      }
      return rawValues.has(value);
    },
    [mode, [...rawValues].toString(), rawValues.size],
  );

  // ========================== Active ==========================
  const getEnabledActiveIndex = (index: number, offset: number = 1): number => {
    const len = memoFlattenOptions.length;

    for (let i = 0; i < len; i += 1) {
      const current = (index + i * offset + len) % len;

      const { group, data } = memoFlattenOptions[current] || {};

      if (!group && !data?.disabled && (isSelected(data.value) || !overMaxCount)) {
        return current;
      }
    }

    return -1;
  };

  const [activeIndex, setActiveIndex] = React.useState(() => getEnabledActiveIndex(0));
  const setActive = (index: number, fromKeyboard = false) => {
    setActiveIndex(index);

    const info = { source: fromKeyboard ? ('keyboard' as const) : ('mouse' as const) };

    // Trigger active event
    const flattenItem = memoFlattenOptions[index];
    if (!flattenItem) {
      onActiveValue(null, -1, info);
      return;
    }
    onActiveValue(flattenItem.value, index, info);
  };

  // Auto active first item when list length or searchValue changed
  useEffect(() => {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [memoFlattenOptions.length, searchValue]);

  // https://github.com/ant-design/ant-design/issues/48036
  const isAriaSelected = React.useCallback(
    (value: RawValueType) => {
      if (mode === 'combobox') {
        return String(value).toLowerCase() === searchValue.toLowerCase();
      }
      return rawValues.has(value);
    },
    [mode, searchValue, [...rawValues].toString(), rawValues.size],
  );

  // Auto scroll to item position in single mode
  useEffect(() => {
    /**
     * React will skip `onChange` when component update.
     * `setActive` function will call root accessibility state update which makes re-render.
     * So we need to delay to let Input component trigger onChange first.
     */
    let timeoutId: NodeJS.Timeout;

    if (!multiple && open && rawValues.size === 1) {
      const value: RawValueType = Array.from(rawValues)[0];
      // Scroll to the option closest to the searchValue if searching.
      const index = memoFlattenOptions.findIndex(({ data }) =>
        searchValue ? String(data.value).startsWith(searchValue) : data.value === value,
      );

      if (index !== -1) {
        setActive(index);
        timeoutId = setTimeout(() => {
          scrollIntoView(index);
        });
      }
    }

    // Force trigger scrollbar visible when open
    if (open) {
      listRef.current?.scrollTo(undefined);
    }

    return () => clearTimeout(timeoutId);
  }, [open, searchValue]);

  // ========================== Values ==========================
  const onSelectValue = (value: RawValueType) => {
    if (value !== undefined) {
      onSelect(value, { selected: !rawValues.has(value) });
    }

    // Single mode should always close by select
    if (!multiple) {
      toggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      const { which, ctrlKey } = event;
      switch (which) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case KeyCode.N:
        case KeyCode.P:
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          } else if (isPlatformMac() && ctrlKey) {
            if (which === KeyCode.N) {
              offset = 1;
            } else if (which === KeyCode.P) {
              offset = -1;
            }
          }

          if (offset !== 0) {
            const nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
            scrollIntoView(nextActiveIndex);
            setActive(nextActiveIndex, true);
          }

          break;
        }

        // >>> Select (Tab / Enter)
        case KeyCode.TAB:
        case KeyCode.ENTER: {
          // value
          const item = memoFlattenOptions[activeIndex];
          if (!item || item.data.disabled) {
            return onSelectValue(undefined);
          }

          if (!overMaxCount || rawValues.has(item.value)) {
            onSelectValue(item.value);
          } else {
            onSelectValue(undefined);
          }

          if (open) {
            event.preventDefault();
          }

          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);
          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},

    scrollTo: (index) => {
      scrollIntoView(index);
    },
  }));

  // ========================== Render ==========================
  if (memoFlattenOptions.length === 0) {
    return (
      <div
        role="listbox"
        id={`${id}_list`}
        className={`${itemPrefixCls}-empty`}
        onMouseDown={onListMouseDown}
      >
        {notFoundContent}
      </div>
    );
  }

  const omitFieldNameList = Object.keys(fieldNames).map((key) => fieldNames[key]);

  const getLabel = (item: Record<string, any>) => item.label;

  function getItemAriaProps(item: FlattenOptionData<BaseOptionType>, index: number) {
    const { group } = item;

    return {
      role: group ? 'presentation' : 'option',
      id: `${id}_list_${index}`,
    };
  }

  const renderItem = (index: number) => {
    const item = memoFlattenOptions[index];
    if (!item) {
      return null;
    }
    const itemData = item.data || {};
    const { value, disabled } = itemData;
    const { group } = item;
    const attrs = pickAttrs(itemData, true);
    const mergedLabel = getLabel(item);
    return item ? (
      <div
        aria-label={typeof mergedLabel === 'string' && !group ? mergedLabel : null}
        {...attrs}
        key={index}
        {...getItemAriaProps(item, index)}
        aria-selected={isAriaSelected(value)}
        aria-disabled={disabled}
      >
        {value}
      </div>
    ) : null;
  };

  const a11yProps = {
    role: 'listbox',
    id: `${id}_list`,
  };

  return (
    <>
      {virtual && (
        <div {...a11yProps} style={{ height: 0, width: 0, overflow: 'hidden' }}>
          {renderItem(activeIndex - 1)}
          {renderItem(activeIndex)}
          {renderItem(activeIndex + 1)}
        </div>
      )}
      <List<FlattenOptionData<BaseOptionType>>
        itemKey="key"
        ref={listRef}
        data={memoFlattenOptions}
        height={listHeight}
        itemHeight={listItemHeight}
        fullHeight={false}
        onMouseDown={onListMouseDown}
        onScroll={onPopupScroll}
        virtual={virtual}
        direction={direction}
        innerProps={virtual ? null : a11yProps}
        showScrollBar={showScrollBar}
        className={contextClassNames?.popup?.list}
        style={contextStyles?.popup?.list}
      >
        {(item, itemIndex) => {
          const { group, groupOption, data, label, value } = item;
          const { key } = data;

          // Group
          if (group) {
            const groupTitle = data.title ?? (isTitleType(label) ? label.toString() : undefined);

            return (
              <div
                className={clsx(itemPrefixCls, `${itemPrefixCls}-group`, data.className)}
                title={groupTitle}
              >
                {label !== undefined ? label : key}
              </div>
            );
          }

          const { disabled, title, children, style, className, ...otherProps } = data;
          const passedProps = omit(otherProps, omitFieldNameList);

          // Option
          const selected = isSelected(value);

          const mergedDisabled = disabled || (!selected && overMaxCount);

          const optionPrefixCls = `${itemPrefixCls}-option`;

          const optionClassName = clsx(
            itemPrefixCls,
            optionPrefixCls,
            className,
            contextClassNames?.popup?.listItem,
            {
              [`${optionPrefixCls}-grouped`]: groupOption,
              [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !mergedDisabled,
              [`${optionPrefixCls}-disabled`]: mergedDisabled,
              [`${optionPrefixCls}-selected`]: selected,
            },
          );

          const mergedLabel = getLabel(item);

          const iconVisible =
            !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;

          // https://github.com/ant-design/ant-design/issues/34145
          const content = typeof mergedLabel === 'number' ? mergedLabel : mergedLabel || value;
          // https://github.com/ant-design/ant-design/issues/26717
          let optionTitle = isTitleType(content) ? content.toString() : undefined;
          if (title !== undefined) {
            optionTitle = title;
          }

          return (
            <div
              {...pickAttrs(passedProps)}
              {...(!virtual ? getItemAriaProps(item, itemIndex) : {})}
              aria-selected={virtual ? undefined : isAriaSelected(value)}
              aria-disabled={mergedDisabled}
              className={optionClassName}
              title={optionTitle}
              onMouseMove={() => {
                if (activeIndex === itemIndex || mergedDisabled) {
                  return;
                }
                setActive(itemIndex);
              }}
              onClick={() => {
                if (!mergedDisabled) {
                  onSelectValue(value);
                }
              }}
              style={{ ...contextStyles?.popup?.listItem, ...style }}
            >
              <div className={`${optionPrefixCls}-content`}>
                {typeof optionRender === 'function'
                  ? optionRender(item, { index: itemIndex })
                  : content}
              </div>
              {React.isValidElement(menuItemSelectedIcon) || selected}
              {iconVisible && (
                <TransBtn
                  className={`${itemPrefixCls}-option-state`}
                  customizeIcon={menuItemSelectedIcon}
                  customizeIconProps={{
                    value,
                    disabled: mergedDisabled,
                    isSelected: selected,
                  }}
                >
                  {selected ? '✓' : null}
                </TransBtn>
              )}
            </div>
          );
        }}
      </List>
    </>
  );
};

const RefOptionList = React.forwardRef(OptionList);

if (process.env.NODE_ENV !== 'production') {
  RefOptionList.displayName = 'OptionList';
}

export default RefOptionList;
