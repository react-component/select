import {
  RawValueType,
  GetLabeledValue,
  LabelValueType,
  DefaultValueType,
  FlattenOptionsType,
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
  { labelInValue, combobox }: { labelInValue: boolean; combobox: boolean },
): RawValueType[] {
  if (value === undefined || (value === '' && combobox)) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  if (labelInValue) {
    return (values as LabelValueType[]).map(
      ({ key, value: val }: LabelValueType) => (val !== undefined ? val : key),
    );
  }

  return values as RawValueType[];
}

/**
 * Convert internal value into out event value
 */
export function toOuterValues<FOT extends FlattenOptionsType>(
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
    getLabeledValue: GetLabeledValue<FOT>;
    options: FOT;
    prevValue: DefaultValueType;
  },
): RawValueType[] | LabelValueType[] {
  let values: DefaultValueType = valueList;

  if (labelInValue) {
    values = values.map(val =>
      getLabeledValue(val, {
        options,
        prevValue,
        labelInValue,
        optionLabelProp,
      }),
    );
  }

  return values;
}

export function removeLastEnabledValue<
  T extends { disabled?: boolean },
  P extends RawValueType | object
>(measureValues: T[], values: P[]): { values: P[]; removedValue: P } {
  const newValues = [...values];

  let removeIndex: number;
  for (
    removeIndex = measureValues.length - 1;
    removeIndex >= 0;
    removeIndex -= 1
  ) {
    if (!measureValues[removeIndex].disabled) {
      break;
    }
  }

  let removedValue = null;

  if (removeIndex !== -1) {
    removedValue = newValues[removeIndex];
    newValues.splice(removeIndex, 1);
  }

  return {
    values: newValues,
    removedValue,
  };
}

export const isClient =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement;

/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && isClient;

let uuid = 0;
/** Get unique id for accessibility usage */
export function getUUID(): number | string {
  let retId: string | number;

  // Test never reach
  /* istanbul ignore if */
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }

  return retId;
}
