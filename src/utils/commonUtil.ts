import { RawValueType, GetLabeledValue, ValueType, LabelValueType } from '../interface/generator';

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

  const values = Array.isArray(value) ? value : [value];

  if (labelInValue) {
    return values.map(item => (item as LabelValueType).value);
  }

  return values as RawValueType[];
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
