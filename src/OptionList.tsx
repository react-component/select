import * as React from 'react';
import { useEffect } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import omit from 'rc-util/lib/omit';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useMemo from 'rc-util/lib/hooks/useMemo';
import classNames from 'classnames';
import type { ListRef } from 'rc-virtual-list';
import List from 'rc-virtual-list';
import TransBtn from './TransBtn';
import { isPlatformMac } from './utils/platformUtil';
import useBaseProps from './hooks/useBaseProps';
import SelectContext from './SelectContext';
import type { BaseOptionType, RawValueType } from './Select';
import type { FlattenOptionData } from './interface';

// export interface OptionListProps<OptionsType extends object[]> {
export type OptionListProps = Record<string, never>;

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (index: number) => void;
}

function isTitleType(content: any) {
  return typeof content === 'string' || typeof content === 'number';
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.ForwardRefRenderFunction<RefOptionListProps, OptionListProps> = (
  _,
  ref,
) => {
  const { prefixCls, id, open, multiple, searchValue, toggleOpen, notFoundContent, onPopupScroll } =
    useBaseProps();
  const {
    flattenOptions,
    onActiveValue,
    defaultActiveFirstOption,
    onSelect,
    menuItemSelectedIcon,
    rawValues,
    fieldNames,
    virtual,
    listHeight,
    listItemHeight,
  } = React.useContext(SelectContext);

  const itemPrefixCls = `${prefixCls}-item`;

  const memoFlattenOptions = useMemo(
    () => flattenOptions,
    [open, flattenOptions],
    (prev, next) => next[0] && prev[1] !== next[1],
  );

  // =========================== List ===========================
  const listRef = React.useRef<ListRef>(null);

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const scrollIntoView = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollTo({ index });
    }
  };

  // ========================== Active ==========================
  const getEnabledActiveIndex = (index: number, offset: number = 1): number => {
    const len = memoFlattenOptions.length;

    for (let i = 0; i < len; i += 1) {
      const current = (index + i * offset + len) % len;

      const { group, data } = memoFlattenOptions[current];
      if (!group && !data.disabled) {
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

  // Auto scroll to item position in single mode
  useEffect(() => {
    /**
     * React will skip `onChange` when component update.
     * `setActive` function will call root accessibility state update which makes re-render.
     * So we need to delay to let Input component trigger onChange first.
     */
    const timeoutId = setTimeout(() => {
      if (!multiple && open && rawValues.size === 1) {
        const value: RawValueType = Array.from(rawValues)[0];
        const index = memoFlattenOptions.findIndex(({ data }) => data.value === value);

        if (index !== -1) {
          setActive(index);
          scrollIntoView(index);
        }
      }
    });

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

        // >>> Select
        case KeyCode.ENTER: {
          // value
          const item = memoFlattenOptions[activeIndex];
          if (item && !item.data.disabled) {
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

  const renderItem = (index: number) => {
    const item = memoFlattenOptions[index];
    if (!item) return null;

    const itemData = item.data || {};
    const { value } = itemData;
    const { group } = item;
    const attrs = pickAttrs(itemData, true);
    const mergedLabel = getLabel(item);
    return item ? (
      <div
        aria-label={typeof mergedLabel === 'string' && !group ? mergedLabel : null}
        {...attrs}
        key={index}
        role={group ? 'presentation' : 'option'}
        id={`${id}_list_${index}`}
        aria-selected={rawValues.has(value)}
      >
        {value}
      </div>
    ) : null;
  };

  return (
    <>
      <div role="listbox" id={`${id}_list`} style={{ height: 0, width: 0, overflow: 'hidden' }}>
        {renderItem(activeIndex - 1)}
        {renderItem(activeIndex)}
        {renderItem(activeIndex + 1)}
      </div>
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
      >
        {(item, itemIndex) => {
          const { group, groupOption, data, label, value } = item;
          const { key } = data;

          // Group
          if (group) {
            const groupTitle = data.title ?? (isTitleType(label) && label);

            return (
              <div
                className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}
                title={groupTitle}
              >
                {label !== undefined ? label : key}
              </div>
            );
          }

          const { disabled, title, children, style, className, ...otherProps } = data;
          const passedProps = omit(otherProps, omitFieldNameList);

          // Option
          const selected = rawValues.has(value);

          const optionPrefixCls = `${itemPrefixCls}-option`;
          const optionClassName = classNames(itemPrefixCls, optionPrefixCls, className, {
            [`${optionPrefixCls}-grouped`]: groupOption,
            [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
            [`${optionPrefixCls}-disabled`]: disabled,
            [`${optionPrefixCls}-selected`]: selected,
          });

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
              {...passedProps}
              aria-selected={selected}
              className={optionClassName}
              title={optionTitle}
              onMouseMove={() => {
                if (activeIndex === itemIndex || disabled) {
                  return;
                }
                setActive(itemIndex);
              }}
              onClick={() => {
                if (!disabled) {
                  onSelectValue(value);
                }
              }}
              style={style}
            >
              <div className={`${optionPrefixCls}-content`}>{content}</div>
              {React.isValidElement(menuItemSelectedIcon) || selected}
              {iconVisible && (
                <TransBtn
                  className={`${itemPrefixCls}-option-state`}
                  customizeIcon={menuItemSelectedIcon}
                  customizeIconProps={{ isSelected: selected }}
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
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
