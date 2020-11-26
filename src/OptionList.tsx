import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useMemo from 'rc-util/lib/hooks/useMemo';
import classNames from 'classnames';
import List, { ListRef } from 'rc-virtual-list';
import TransBtn from './TransBtn';
import {
  FlattenOptionData,
  OptionData,
  RenderNode,
  OnActiveValue,
} from './interface';
import { RawValueType } from './interface/generator';

export interface OptionListProps {
  prefixCls: string;
  id: string;
  displayOptions: FlattenOptionData[];
  optionSelectableLabelProp: string;
  height: number;
  itemHeight: number;
  values: Set<RawValueType>;
  multiple: boolean;
  open: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;
  searchValue: string;
  virtual: boolean;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  requestSetIsDropdownVisible: (open?: boolean) => void;
  /** Tell Select that some value is now active to make accessibility work */
  onActiveValue: OnActiveValue;
  onScroll: React.UIEventHandler<HTMLDivElement>;

  /** Tell Select that mouse enter the popup to force re-render */
  onMouseEnter?: React.MouseEventHandler;
}

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (index: number) => void;
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.RefForwardingComponent<
  RefOptionListProps,
  OptionListProps
> = (
  {
    prefixCls,
    id,
    displayOptions: receivedDisplayOptions = [],
    optionSelectableLabelProp,
    values,
    searchValue,
    multiple,
    defaultActiveFirstOption,
    height,
    itemHeight,
    notFoundContent,
    open,
    menuItemSelectedIcon,
    virtual,
    onSelect,
    requestSetIsDropdownVisible,
    onActiveValue,
    onScroll,
    onMouseEnter,
  },
  ref,
) => {
  const itemPrefixCls = `${prefixCls}-item`;

  const displayOptions = useMemo(
    () => receivedDisplayOptions,
    [open, receivedDisplayOptions],
    ([, previousReceivedDisplayOptions]) =>
      open && previousReceivedDisplayOptions !== receivedDisplayOptions,
  );

  // =========================== List ===========================
  const listRef = React.useRef<ListRef>(null);

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
  };

  const scrollIntoView = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollTo({ index });
    }
  };

  // ========================== Active ==========================
  const getEnabledActiveIndex = (index: number, offset: number = 1): number => {
    const len = displayOptions.length;

    for (let i = 0; i < len; i += 1) {
      const current = (index + i * offset + len) % len;

      const { group, data } = displayOptions[current];
      if (!group && !(data as OptionData).disabled) {
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
    const activeDisplayOption = displayOptions[index];
    if (!activeDisplayOption) {
      onActiveValue(null, -1, info);
      return;
    }

    onActiveValue((activeDisplayOption.data as OptionData).value, index, info);
  };

  // Auto active first item when list length or searchValue changed
  React.useEffect(() => {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [displayOptions.length, searchValue]);

  // Auto scroll to item position in single mode
  React.useEffect(() => {
    if (open) {
      /**
       * React will skip `onChange` when component update.
       * `setActive` function will call root accessibility state update which makes re-render.
       * So we need to delay to let Input component trigger onChange first.
       */
      const timeoutId = setTimeout(() => {
        if (!multiple && values.size === 1) {
          const value: RawValueType = Array.from(values)[0];
          const index = displayOptions.findIndex(
            ({ data }) => (data as OptionData).value === value,
          );
          setActive(index);
          scrollIntoView(index);
        }
      });

      // Force trigger scrollbar visible when open
      listRef.current?.scrollTo(undefined);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [open]);

  // ========================== Values ==========================
  const onSelectValue = (value: RawValueType) => {
    if (value !== undefined) {
      onSelect(value, { selected: !values.has(value) });
    }

    // Single mode should always close by select
    if (!multiple) {
      requestSetIsDropdownVisible(false);
    }
  };

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: event => {
      const { which } = event;
      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          const offset = which === KeyCode.UP ? -1 : 1;
          const nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
          scrollIntoView(nextActiveIndex);
          setActive(nextActiveIndex, true);

          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          // value
          const displayOption = displayOptions[activeIndex];
          if (displayOption && !(displayOption.data as OptionData).disabled) {
            onSelectValue((displayOption.data as OptionData).value);
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
          requestSetIsDropdownVisible(false);
        }
      }
    },
    onKeyUp: () => {},

    scrollTo: index => {
      scrollIntoView(index);
    },
  }));

  // ========================== Render ==========================
  if (displayOptions.length === 0) {
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

  function renderItem(index: number) {
    const displayOption = displayOptions[index];
    if (!displayOption) return null;

    const displayOptionData = (displayOption.data || {}) as OptionData;
    const {
      value,
      [optionSelectableLabelProp]: label,
    } = displayOptionData;
    return (
      <div
        aria-label={typeof label === 'string' ? label : null}
        {...pickAttrs(displayOptionData, true)}
        key={index}
        role="option"
        id={`${id}_list_${index}`}
        aria-selected={values.has(value)}
      >
        {value}
      </div>
    );
  }

  return (
    <>
      <div role="listbox" id={`${id}_list`} style={{ height: 0, width: 0, overflow: 'hidden' }}>
        {renderItem(activeIndex - 1)}
        {renderItem(activeIndex)}
        {renderItem(activeIndex + 1)}
      </div>
      <List<FlattenOptionData>
        itemKey="key"
        ref={listRef}
        data={displayOptions}
        height={height}
        itemHeight={itemHeight}
        fullHeight={false}
        onMouseDown={onListMouseDown}
        onScroll={onScroll}
        virtual={virtual}
        onMouseEnter={onMouseEnter}
      >
        {({ group, groupOption, data }, itemIndex) => {
          // Group
          if (group) {
            const { label, key } = data;
            return (
              <div className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>
                {label !== undefined ? label : key}
              </div>
            );
          }

          const {
            disabled,
            value,
            title,
            children,
            style,
            className,
            [optionSelectableLabelProp]: label,
            ...otherProps
          } = data as OptionData;

          // Option
          const selected = values.has(value);

          const optionPrefixCls = `${itemPrefixCls}-option`;
          const optionClassName = classNames(itemPrefixCls, optionPrefixCls, className, {
            [`${optionPrefixCls}-grouped`]: groupOption,
            [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
            [`${optionPrefixCls}-disabled`]: disabled,
            [`${optionPrefixCls}-selected`]: selected,
          });

          const iconVisible =
            !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;

          const content = label || value;
          // https://github.com/ant-design/ant-design/issues/26717
          let optionTitle =
            typeof content === 'string' || typeof content === 'number'
              ? content.toString()
              : undefined;
          if (title !== undefined) {
            optionTitle = title;
          }

          return (
            <div
              {...otherProps}
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

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps>(
  OptionList,
);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
