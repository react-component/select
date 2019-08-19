import {
  LabelValueType,
  ValueType,
  RawValueType,
  OptionsType,
  OptionData,
  OptionGroupData,
  FlattenOptionData,
} from '../interface';

export function formatValue(isLabelInValue: boolean, value: ValueType = []): LabelValueType[] {
  let result: (RawValueType | LabelValueType)[] = Array.isArray(value) ? value : [value];

  if (isLabelInValue) {
    return result as LabelValueType[];
  }

  return (result as RawValueType[]).map(value => ({
    value,
  }));
}

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
  options: OptionsType,
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

export function isSameValue(prev: RawValueType[], next: RawValueType[]) {
  if (prev.length !== next.length) {
    return false;
  }

  const set: Set<RawValueType> = new Set(prev);

  return next.every(val => set.has(val));
}

/**
 * Convert internal value into out event value
 */
export function toOuterValue(
  valueList: RawValueType[],
  { multiple, labelInValue }: { multiple: boolean; labelInValue: boolean },
): ValueType {
  let values = valueList;

  // TODO: handle label in value

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
