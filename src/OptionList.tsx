import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import List from 'rc-virtual-list';
import { OptionsType, FlattenOptionData, Key, RawValueType, OptionData } from './interface';
import { flattenOptions } from './utils/valueUtil';

export interface OptionListProps {
  prefixCls: string;
  id: string;
  options: OptionsType;
  values: Set<RawValueType>;
  multiple: boolean;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onToggleOpen: (open?: boolean) => void;
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
  { prefixCls, id, options, values, multiple, onSelect, onToggleOpen },
  ref,
) => {
  const itemPrefixCls = `${prefixCls}-item`;

  // =========================== List ===========================
  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

  // ========================== Active ==========================
  const getEnabledActiveIndex = (index: number, offset: number = 1): number => {
    const len = flattenList.length;
    let current = (index + len) % len;

    for (; current < len && current >= 0; current += offset) {
      const { group, data } = flattenList[current];
      if (!group && !(data as OptionData).disabled) {
        break;
      }
    }

    return current !== len ? current : 0;
  };

  const [activeIndex, setActiveIndex] = React.useState(() => getEnabledActiveIndex(0));

  // ========================== Values ==========================
  const onSelectValue = (value: RawValueType, source?: 'SPACE' | 'ENTER') => {
    onSelect(value, { selected: !values.has(value) });

    // TODO: handle multiple
    if (!multiple || source === 'ENTER') {
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
            setActiveIndex(getEnabledActiveIndex(activeIndex + offset, offset));
          }

          break;
        }

        // >>> Select
        case KeyCode.SPACE:
        case KeyCode.ENTER: {
          // value
          const item = flattenList[activeIndex];
          if (item && !(item.data as OptionData).disabled) {
            onSelectValue(
              (item.data as OptionData).value,
              which === KeyCode.SPACE ? 'SPACE' : 'ENTER',
            );
          }

          break;
        }
      }
    },
    onKeyUp: () => {},
  }));

  return (
    <List<FlattenOptionData> data={flattenList} itemKey="key" role="listbox">
      {({ key, group, groupOption, data }, itemIndex) => {
        const { label } = data;

        // Group
        if (group) {
          return <div className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>{label}</div>;
        }

        const { disabled, value } = data as OptionData;

        // Option
        const optionClassName = classNames(itemPrefixCls, `${itemPrefixCls}-option`, {
          [`${itemPrefixCls}-option-grouped`]: groupOption,
          [`${itemPrefixCls}-option-active`]: activeIndex === itemIndex && !disabled,
          [`${itemPrefixCls}-option-disabled`]: disabled,
          [`${itemPrefixCls}-option-selected`]: values.has(value),
        });

        return (
          <div
            id={`${id}_list`}
            role="item"
            className={optionClassName}
            onMouseMove={() => {
              if (activeIndex === itemIndex) {
                return;
              }

              setActiveIndex(itemIndex);
            }}
            onClick={() => {
              onSelectValue(value);
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
