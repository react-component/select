import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import List from 'rc-virtual-list';
import { OptionsType, FlattenOptionData, Key, RawValueType } from './interface';
import { flattenOptions } from './utils/valueUtil';

export interface OptionListProps {
  prefixCls: string;
  id: string;
  options: OptionsType;
  /** Always return as array */
  onSelect: (value: RawValueType[]) => void;
}

export interface RefProps {
  onKeyDown: React.KeyboardEventHandler;
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.RefForwardingComponent<RefProps, OptionListProps> = (
  { prefixCls, id, options, onSelect },
  ref,
) => {
  const itemPrefixCls = `${prefixCls}-item`;

  // =========================== List ===========================
  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

  // ========================== Active ==========================
  /**
   * `activeIndex` only consider option and ignore option group,
   * since option group is no need to be focused.
   */
  const [activeIndex, setActiveIndex] = React.useState(0);
  const indexKeyMap: Key[] = React.useMemo<Key[]>(() => {
    let index = 0;
    const indexList: Key[] = [];
    flattenList.forEach(item => {
      if (!item.group) {
        indexList[index] = item.key;
        index += 1;
      }
    });

    return indexList;
  }, [flattenList]);

  const activeKey = indexKeyMap[activeIndex];

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ which }) => {
      let offset = 0;
      if (which === KeyCode.UP) {
        offset = -1;
      } else if (which === KeyCode.DOWN) {
        offset = 1;
      }

      if (offset !== 0) {
        const len = indexKeyMap.length;
        setActiveIndex((activeIndex + offset + len) % len);
      }
    },
  }));

  return (
    <List<FlattenOptionData> data={flattenList} itemKey="key" role="listbox">
      {({ key, group, groupOption, data }) => {
        const { label } = data;

        // Group
        if (group) {
          return <div className={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>{label}</div>;
        }

        // Option
        const optionClassName = classNames(itemPrefixCls, `${itemPrefixCls}-option`, {
          [`${itemPrefixCls}-option-grouped`]: groupOption,
          [`${itemPrefixCls}-option-active`]: activeKey === key,
        });

        return (
          <div
            id={`${id}_list`}
            role="item"
            className={optionClassName}
            onMouseEnter={() => {
              const index = indexKeyMap.findIndex(indexKey => indexKey === key);
              setActiveIndex(index);
            }}
            onClick={() => {
              onSelect([data.value]);
            }}
          >
            {label}
          </div>
        );
      }}
    </List>
  );
};

export default React.forwardRef<RefProps, OptionListProps>(OptionList);
