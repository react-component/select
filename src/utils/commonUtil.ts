import {
  RawValueType,
  GetLabeledValue,
  LabelValueType,
  DefaultValueType,
} from '../interface/generator';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

/**
 * Convert outer props value into internal value
 */
export function toInnerValue(
  value: DefaultValueType,
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
    optionLabelProp,
    labelInValue,
    prevValue,
    options,
    getLabeledValue,
  }: {
    optionLabelProp: string;
    labelInValue: boolean;
    getLabeledValue: GetLabeledValue<OptionsType>;
    options: OptionsType;
    prevValue: DefaultValueType;
  },
): RawValueType[] | LabelValueType[] {
  let values: DefaultValueType = valueList;

  if (labelInValue) {
    values = values.map(val =>
      getLabeledValue(val, { options, prevValue, labelInValue, optionLabelProp }),
    );
  }

  return values;
}

export function removeLastEnabledValue<T extends { disabled?: boolean }, P extends object>(
  measureValues: T[],
  values: P[],
): P[] {
  const newValues = [...values];

  let removeIndex: number;
  for (removeIndex = measureValues.length - 1; removeIndex >= 0; removeIndex -= 1) {
    if (!measureValues[removeIndex].disabled) {
      break;
    }
  }

  if (removeIndex !== -1) {
    newValues.splice(removeIndex, 1);
  }

  return newValues;
}