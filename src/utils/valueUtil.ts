import {
  OptionsType as SelectOptionsType,
  OptionData,
  OptionGroupData,
  FlattenOptionData,
} from '../interface';
import { LabelValueType, ValueType, GetLabeledValue } from '../interface/generator';
import { RawValueType } from '../interface/generator';

function getKey(data: OptionData | OptionGroupData, index: number) {
  const { key } = data;
  let value: RawValueType;

  if ('value' in data) {
    value = data.value;
  }

  if (key !== null && key !== undefined) {
    return key;
  } else if (value !== undefined) {
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

/**
 * Convert internal value into out event value
 */
export function toOuterValue<OptionsType>(
  valueList: RawValueType[],
  {
    multiple,
    labelInValue,
    prevValue,
    options,
    getLabeledValue,
  }: {
    multiple: boolean;
    labelInValue: boolean;
    getLabeledValue: GetLabeledValue<OptionsType>;
    options: OptionsType;
    prevValue: ValueType;
  },
): ValueType {
  let values: ValueType = valueList;

  if (labelInValue) {
    values = values.map(val => getLabeledValue(val, options, prevValue));
  }

  if (!multiple) {
    return values[0];
  }

  return values;
}

/**
 * Convert outer props value into internal value
 */
export function toInnerValue(
  value: ValueType,
  { labelInValue }: { labelInValue: boolean },
): RawValueType[] {
  if (value === undefined || value === null) {
    return [];
  }

  let values = Array.isArray(value) ? value : [value];

  if (labelInValue) {
    return values.map(item => (item as LabelValueType).value);
  }

  return values as RawValueType[];
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
      })
    ) {
      return true;
    }

    // Check if match
    if ((option as OptionData).value === value) {
      optionItem = option as OptionData;
      return true;
    }
  });

  return optionItem;
}

export function getLabeledValue(
  value: RawValueType,
  options: SelectOptionsType,
  prevValue: ValueType,
) {
  const item = findValueItem(value, options);
  const result: LabelValueType = {
    value,
  };

  if (item) {
    result.label = 'label' in item ? item.label : item.value;
  } else {
    const prevValues = Array.isArray(prevValue) ? prevValue : [prevValue];

    // Try to find item in the prev values
    const prevValItem = prevValues.find(
      (item: LabelValueType) => 'value' in item && item.value === value,
    ) as LabelValueType;

    if (prevValItem && prevValItem.label) {
      result.label = prevValItem.label;
    }
  }

  return result;
}
