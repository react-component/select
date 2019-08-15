import * as React from 'react';
import List from 'rc-virtual-list';
import { LabelValueType, OptionsType, FlattenOptionData } from './interface';
import { flattenOptions } from './utils/valueUtil';

export interface OptionListProps {
  id: string;
  options: OptionsType;
}

function getKey({ key, value }: LabelValueType): string {
  return String(key === undefined || key === null ? value : key);
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.FC<OptionListProps> = ({ id, options }) => {
  console.log('List:', options);

  const flattenList: FlattenOptionData[] = React.useMemo<FlattenOptionData[]>(
    () => flattenOptions(options),
    [options],
  );

  return (
    <List<FlattenOptionData> data={flattenList} itemKey={getKey} role="listbox">
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

export default OptionList;
