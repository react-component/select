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
export function toOuterValues<OptionsType>(
  valueList: RawValueType[],
  {
    labelInValue,
    prevValue,
    options,
    getLabeledValue,
  }: {
    labelInValue: boolean;
    getLabeledValue: GetLabeledValue<OptionsType>;
    options: OptionsType;
    prevValue: ValueType;
  },
): RawValueType[] | LabelValueType[] {
  let values: ValueType = valueList;

  if (labelInValue) {
    values = values.map(val => getLabeledValue(val, options, prevValue));
  }

  return values;
}
