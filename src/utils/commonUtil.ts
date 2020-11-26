import { RawValueType } from '../interface/generator';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

/* eslint-disable no-shadow */

export const toMap = (
  data,
  getKey = data => data.value,
  getValue = data => data,
) => {
  const map = new Map();
  data.forEach(dataItem => {
    map.set(getKey(dataItem), getValue(dataItem));
  });
  return map;
};

export const toMapByValue = (
  data,
  getValue = data => data,
) => toMap(data, data => data.value, getValue);

/* eslint-enable no-shadow */

export function removeLastEnabledValue<
  T extends { disabled?: boolean },
  P extends RawValueType | object
>(measureValues: T[], values: P[]): { values: P[]; removedValue: P } {
  const newValues = [...values];

  let removeIndex: number;
  for (removeIndex = measureValues.length - 1; removeIndex >= 0; removeIndex -= 1) {
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
  typeof window !== 'undefined' && window.document && window.document.documentElement;

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
