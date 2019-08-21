import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import List from 'rc-virtual-list';
import { OptionsType, FlattenOptionData, OptionData } from './interface';
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
  defaultActiveFirstOption?: boolean;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onToggleOpen: (open?: boolean) => void;
  /** Tell Select that some value is now active to make accessibility work */
  onActiveTitle: (index: number) => void;
}

export interface RefProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.RefForwardingComponent<RefProps, OptionListProps> = (
  {
    prefixCls,
    id,
    options,
    values,
    multiple,
    defaultActiveFirstOption,
    height,
    itemHeight,
    onSelect,
    onToggleOpen,
    onActiveTitle,
  },
  ref,
) => {
  const itemPrefixCls = `${prefixCls}-item`;

  // =========================== List ===========================
  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
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
      onActiveTitle(-1);
      return;
    }

    onActiveTitle(index);
  };

  React.useEffect(() => {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [flattenList.length]);

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
            setActive(getEnabledActiveIndex(activeIndex + offset, offset));
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

  return (
    <List<FlattenOptionData>
      data={flattenList}
      itemKey="key"
      role="listbox"
      id={`${id}_list`}
      height={height}
      itemHeight={itemHeight}
      onMouseDown={onListMouseDown}
    >
      {({ key, group, groupOption, data }, itemIndex) => {
        const { label } = data;

        // Group
        if (group) {
          return <div className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>{label}</div>;
        }

        const { disabled, value } = data as OptionData;

        // Option
        const selected = values.has(value);

        const optionClassName = classNames(itemPrefixCls, `${itemPrefixCls}-option`, {
          [`${itemPrefixCls}-option-grouped`]: groupOption,
          [`${itemPrefixCls}-option-active`]: activeIndex === itemIndex && !disabled,
          [`${itemPrefixCls}-option-disabled`]: disabled,
          [`${itemPrefixCls}-option-selected`]: selected,
        });

        return (
          <div
            role="option"
            id={`${id}_list_${itemIndex}`}
            aria-selected={selected}
            className={optionClassName}
            onMouseMove={() => {
              if (activeIndex === itemIndex) {
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
            {label || value}
          </div>
        );
      }}
    </List>
  );
};

export default React.forwardRef<RefProps, OptionListProps>(OptionList);
