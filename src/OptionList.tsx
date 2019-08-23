import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import List from 'rc-virtual-list';
import TransBtn from './TransBtn';
import { OptionsType, FlattenOptionData, OptionData, RenderNode } from './interface';
import { RawValueType } from './interface/generator';
import { flattenOptions } from './utils/valueUtil';

export interface OptionListProps {
  prefixCls: string;
  id: string;
  options: OptionsType;
  height: number;
  itemHeight: number;
  values: Set<RawValueType>;
  multiple: boolean;
  open: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;
  childrenAsData: boolean;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onToggleOpen: (open?: boolean) => void;
  /** Tell Select that some value is now active to make accessibility work */
  onActiveValue: (value: RawValueType, index: number) => void;
  onScroll: React.UIEventHandler<HTMLDivElement>;
}

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.RefForwardingComponent<RefOptionListProps, OptionListProps> = (
  {
    prefixCls,
    id,
    options,
    childrenAsData,
    values,
    multiple,
    defaultActiveFirstOption,
    height,
    itemHeight,
    notFoundContent,
    open,
    menuItemSelectedIcon,
    onSelect,
    onToggleOpen,
    onActiveValue,
    onScroll,
  },
  ref,
) => {
  const itemPrefixCls = `${prefixCls}-item`;

  // =========================== List ===========================
  const listRef = React.useRef<List>(null);
  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

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
    const len = flattenList.length;

    for (let i = 0; i < len; i += 1) {
      const current = (index + i * offset + len) % len;

      const { group, data } = flattenList[current];
      if (!group && !(data as OptionData).disabled) {
        return current;
      }
    }

    return -1;
  };

  const [activeIndex, setActiveIndex] = React.useState(() => getEnabledActiveIndex(0));
  const setActive = (index: number) => {
    setActiveIndex(index);

    // Trigger active event
    const flattenItem = flattenList[index];
    if (!flattenItem) {
      onActiveValue(null, -1);
      return;
    }

    onActiveValue((flattenItem.data as OptionData).value, index);
  };

  // Auto active first item when list length changed
  React.useEffect(() => {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [flattenList.length]);

  // Auto scroll to item position in single mode
  React.useEffect(() => {
    if (!multiple && open && values.size === 1) {
      const value: RawValueType = Array.from(values)[0];
      const index = flattenList.findIndex(({ data }) => (data as OptionData).value === value);
      setActive(index);
      scrollIntoView(index);
    }
  }, [open]);

  // ========================== Values ==========================
  const onSelectValue = (value: RawValueType) => {
    onSelect(value, { selected: !values.has(value) });

    if (!multiple) {
      onToggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ which }) => {
      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          }

          if (offset !== 0) {
            const nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
            scrollIntoView(nextActiveIndex);
            setActive(nextActiveIndex);
          }

          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          // value
          const item = flattenList[activeIndex];
          if (item && !(item.data as OptionData).disabled) {
            onSelectValue((item.data as OptionData).value);
          }

          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          onToggleOpen(false);
        }
      }
    },
    onKeyUp: () => {},
  }));

  // ========================== Render ==========================
  if (flattenList.length === 0) {
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
    const item = flattenList[index];
    const value = item && (item.data as OptionData).value;
    return item ? (
      <div key={index} role="option" id={`${id}_list_${index}`} aria-selected={values.has(value)}>
        {value}
      </div>
    ) : null;
  }

  return (
    <>
      <div role="listbox" id={`${id}_list`} style={{ height: 0, overflow: 'hidden' }}>
        {renderItem(activeIndex - 1)}
        {renderItem(activeIndex)}
        {renderItem(activeIndex + 1)}
      </div>
      <List<FlattenOptionData>
        itemKey="key"
        ref={listRef}
        data={flattenList}
        height={height}
        itemHeight={itemHeight}
        onMouseDown={onListMouseDown}
        onScroll={onScroll}
      >
        {({ group, groupOption, data }, itemIndex) => {
          const { label } = data;

          // Group
          if (group) {
            return (
              <div className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>{label}</div>
            );
          }

          const { disabled, value, children } = data as OptionData;

          // Option
          const selected = values.has(value);

          const optionClassName = classNames(itemPrefixCls, `${itemPrefixCls}-option`, {
            [`${itemPrefixCls}-option-grouped`]: groupOption,
            [`${itemPrefixCls}-option-active`]: activeIndex === itemIndex && !disabled,
            [`${itemPrefixCls}-option-disabled`]: disabled,
            [`${itemPrefixCls}-option-selected`]: selected,
          });

          const mergedLabel = childrenAsData ? children : label;

          return (
            <div
              aria-selected={selected}
              className={optionClassName}
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
            >
              {mergedLabel || value}
              {selected && (
                <TransBtn
                  className={`${itemPrefixCls}-option-selected-icon`}
                  customizeIcon={menuItemSelectedIcon}
                >
                  ✓
                </TransBtn>
              )}
            </div>
          );
        }}
      </List>
    </>
  );
};

export default React.forwardRef<RefOptionListProps, OptionListProps>(OptionList);
