import warning from 'rc-util/lib/warning';
import {
  OptionsType as SelectOptionsType,
  OptionData,
  OptionGroupData,
  FlattenOptionData,
} from '../interface';
import {
  LabelValueType,
  FilterFunc,
  RawValueType,
  GetLabeledValue,
  DefaultValueType,
} from '../interface/generator';

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
export function flattenOptions(options: SelectOptionsType): FlattenOptionData[] {
  const flattenList: FlattenOptionData[] = [];

  function dig(list: SelectOptionsType, isGroupOption: boolean) {
    list.forEach(data => {
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

        dig(data.options, true);
      }
    });
  }

  dig(options, false);

  return flattenList;
}

/**
 * Inject `props` into `option` for legacy usage
 */
function injectPropsWithOption<T>(option: T): T {
  const newOption = { ...option };
  if (!('props' in newOption)) {
    Object.defineProperty(newOption, 'props', {
      get() {
        warning(
          false,
          'Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
        );
        return newOption;
      },
    });
  }

  return newOption;
}

export function findValueOption(
  values: RawValueType[],
  optionMap: Map<RawValueType, OptionData>,
): OptionData[] {
  return values.map(val => injectPropsWithOption(optionMap.get(val)));
}

export const getLabeledValue: GetLabeledValue<Map<RawValueType, OptionData>> = (
  value,
  { optionMap, prevValue, labelInValue, optionLabelProp },
) => {
  const item = findValueOption([value], optionMap)[0];
  const result: LabelValueType = {
    value,
  };

  let prevValItem: LabelValueType;
  const prevValues = toArray<RawValueType | LabelValueType>(prevValue);
  if (labelInValue) {
    prevValItem = prevValues.find((prevItem: LabelValueType) => {
      if (typeof prevItem === 'object' && 'value' in prevItem) {
        return prevItem.value === value;
      }
      // [Legacy] Support `key` as `value`
      return prevItem.key === value;
    }) as LabelValueType;
  }

  if (prevValItem && typeof prevValItem === 'object' && 'label' in prevValItem) {
    result.label = prevValItem.label;

    if (
      item &&
      typeof prevValItem.label === 'string' &&
      typeof item[optionLabelProp] === 'string' &&
      prevValItem.label.trim() !== item[optionLabelProp].trim()
    ) {
      warning(false, '`label` of `value` is not same as `label` in Select options.');
    }
  } else if (item && optionLabelProp in item) {
    result.label = item[optionLabelProp];
  } else {
    result.label = value;
  }

  // [Legacy] We need fill `key` as `value` to compatible old code usage
  result.key = result.value;

  return result;
};

function toRawString(content: React.ReactNode): string {
  return toArray(content).join('');
}

/** Filter single option if match the search text */
function getFilterFunction(optionFilterProp: string) {
  return (searchValue: string, option: OptionData | OptionGroupData) => {
    const lowerSearchText = searchValue.toLowerCase();

    // Group label search
    if ('options' in option) {
      return toRawString(option.label)
        .toLowerCase()
        .includes(lowerSearchText);
    }

    // Option value search
    const rawValue = option[optionFilterProp];
    const value = toRawString(rawValue).toLowerCase();
    return value.includes(lowerSearchText) && !option.disabled;
  };
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: SelectOptionsType,
  {
    optionFilterProp,
    filterOption,
  }: { optionFilterProp: string; filterOption: boolean | FilterFunc<SelectOptionsType[number]> },
) {
  const filteredOptions: SelectOptionsType = [];
  let filterFunc: FilterFunc<SelectOptionsType[number]>;

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
      // Check group first
      const matchGroup = filterFunc(searchValue, item);
      if (matchGroup) {
        filteredOptions.push(item);
      } else {
        // Check option
        const subOptions = item.options.filter(subItem => filterFunc(searchValue, subItem));
        if (subOptions.length) {
          filteredOptions.push({
            ...item,
            options: subOptions,
          });
        }
      }

      return;
    }

    if (filterFunc(searchValue, injectPropsWithOption(item))) {
      filteredOptions.push(item);
    }
  });

  return filteredOptions;
}

export function getSeparatedContent(text: string, tokens: string[]): string[] {
  if (!tokens || !tokens.length) {
    return null;
  }

  let match = false;

  function separate(str: string, [token, ...restTokens]: string[]) {
    if (!token) {
      return [str];
    }

    const list = str.split(token);
    match = match || list.length > 1;

    return list
      .reduce((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], [])
      .filter(unit => unit);
  }

  const list = separate(text, tokens);
  return match ? list : null;
}

export function isValueDisabled(
  value: RawValueType,
  optionMap: Map<RawValueType, OptionData>,
): boolean {
  const option = findValueOption([value], optionMap)[0];
  return option.disabled;
}

/**
 * `tags` mode should fill un-list item into the option list
 */
export function fillOptionsWithMissingValue(
  options: SelectOptionsType,
  value: DefaultValueType,
  optionLabelProp: string,
  labelInValue: boolean,
): SelectOptionsType {
  const values = toArray<RawValueType | LabelValueType>(value)
    .slice()
    .sort();
  const cloneOptions = [...options];

  // Convert options value to set
  const optionValues = new Set<RawValueType>();
  options.forEach(opt => {
    if (opt.options) {
      opt.options.forEach((subOpt: OptionData) => {
        optionValues.add(subOpt.value);
      });
    } else {
      optionValues.add((opt as OptionData).value);
    }
  });

  // Fill missing value
  values.forEach(item => {
    const val: RawValueType = labelInValue
      ? (item as LabelValueType).value
      : (item as RawValueType);

    if (!optionValues.has(val)) {
      cloneOptions.push(
        labelInValue
          ? {
              [optionLabelProp]: (item as LabelValueType).label,
              value: val,
            }
          : { value: val },
      );
    }
  });

  return cloneOptions;
}
