import warning from 'rc-util/lib/warning';
import {
  OptionsType as SelectOptionsType,
  OptionData,
  OptionGroupData,
  FlattenOptionData,
} from '../interface';
import { LabelValueType, ValueType, FilterFunc, RawValueType } from '../interface/generator';

import { SelectProps } from '../Select';
import { toArray } from './commonUtil';

function getKey(data: OptionData | OptionGroupData, index: number) {
  const { key } = data;
  let value: RawValueType;

  if ('value' in data) {
    ({ value } = data);
  }

  if (key !== null && key !== undefined) {
    return key;
  }
  if (value !== undefined) {
    return value;
  }
  return `rc-index-key-${index}`;
}

/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions(
  options: SelectOptionsType,
  rootFlattenList?: FlattenOptionData[],
): FlattenOptionData[] {
  const flattenList: FlattenOptionData[] = rootFlattenList || [];
  const isGroupOption = !!rootFlattenList;

  options.forEach(data => {
    if (isGroupOption || !('options' in data)) {
      // Option
      flattenList.push({
        key: getKey(data, flattenList.length),
        groupOption: isGroupOption,
        data,
      });
    } else {
      // Option Group
      flattenList.push({
        key: getKey(data, flattenList.length),
        group: true,
        data,
      });

      flattenOptions(data.options, flattenList);
    }
  });

  return flattenList;
}

function findValueItem(value: RawValueType, options: SelectOptionsType): OptionData {
  let optionItem: OptionData;

  options.some(option => {
    // Loop if is a group
    if (
      'options' in option &&
      option.options.some(subOption => {
        if (subOption.value === value) {
          optionItem = subOption;
          return true;
        }
        return false;
      })
    ) {
      return true;
    }

    // Check if match
    if ((option as OptionData).value === value) {
      optionItem = option as OptionData;
      return true;
    }

    return false;
  });

  return optionItem;
}

export function getLabeledValue(
  value: RawValueType,
  options: SelectOptionsType,
  prevValue: ValueType,
  labelInValue: boolean,
) {
  const item = findValueItem(value, options);
  const result: LabelValueType = {
    value,
  };

  let prevValItem: LabelValueType;
  const prevValues = toArray<RawValueType | LabelValueType>(prevValue);
  if (labelInValue) {
    prevValItem = prevValues.find(
      (prevItem: LabelValueType) => 'value' in prevItem && prevItem.value === value,
    ) as LabelValueType;
  }

  if (prevValItem && 'label' in prevValItem) {
    result.label = prevValItem.label;

    if (
      item &&
      typeof prevValItem.label === 'string' &&
      typeof item.label === 'string' &&
      prevValItem.label.trim() !== item.label.trim()
    ) {
      warning(false, '`label` of `value` is not same as `label` in Select options.');
    }
  } else if (item && 'label' in item) {
    result.label = item.label;
  } else {
    result.label = value;
  }

  // [Legacy] We need fill `key` as `value` to compatible old code usage
  result.key = result.value;

  return result;
}

/** Filter single option if match the search text */
function getFilterFunction(optionFilterProp: string) {
  return (searchValue: string, option: OptionData) => {
    const value = String(option[optionFilterProp]).toLowerCase();
    return value.includes(searchValue.toLowerCase());
  };
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: SelectOptionsType,
  { optionFilterProp, filterOption }: SelectProps<SelectOptionsType>,
) {
  const filteredOptions: SelectOptionsType = [];
  let filterFunc: FilterFunc;

  if (filterOption === false) {
    return options;
  }
  if (typeof filterOption === 'function') {
    filterFunc = filterOption;
  } else {
    filterFunc = getFilterFunction(optionFilterProp);
  }

  options.forEach(item => {
    // Group should check child options
    if ('options' in item) {
      const subOptions = item.options.filter(subItem => filterFunc(searchValue, subItem));
      if (subOptions.length) {
        filteredOptions.push({
          ...item,
          options: subOptions,
        });
      }

      return;
    }

    if (filterFunc(searchValue, item)) {
      filteredOptions.push(item);
    }
  });

  return filteredOptions;
}
