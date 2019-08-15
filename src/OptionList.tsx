import * as React from 'react';
import List from 'rc-virtual-list';
import { LabelValueType, OptionsType, FlattenOptionData } from './interface';
import { flattenOptions } from './utils/valueUtil';

export interface OptionListProps {
  id: string;
  options: OptionsType;
}

export interface RefProps {
  onKeyDown: React.KeyboardEventHandler;
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.RefForwardingComponent<RefProps, OptionListProps> = (
  { id, options },
  ref,
) => {
  // Keyboard operation
  React.useImperativeHandle(ref, () => ({
    onKeyDown: () => {
      console.log(2333);
    },
  }));

  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

  return (
    <List<FlattenOptionData> data={flattenList} itemKey="key" role="listbox">
      {({ key, group, groupOption, data }) => {
        const { label } = data;

        // Group
        if (group) {
          return <div>{label}</div>;
        }

        // Option
        return (
          <div id={`${id}_list`} role="item">
            {label}
          </div>
        );
      }}
    </List>
  );
};

export default React.forwardRef<RefProps, OptionListProps>(OptionList);
