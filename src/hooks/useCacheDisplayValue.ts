import * as React from 'react';
import type { DisplayLabelValueType } from '../interface/generator';

export default function useCacheDisplayValue(
  values: DisplayLabelValueType[],
): DisplayLabelValueType[] {
  const prevValuesRef = React.useRef(values);

  const mergedValues = React.useMemo(() => {
    // Create value - label map
    const valueLabels = new Map();
    prevValuesRef.current.forEach(({ value, label }) => {
      if (value !== label) {
        valueLabels.set(value, label);
      }
    });

    const resultValues = values.map((item) => {
      const cacheLabel = valueLabels.get(item.value);
      if (item.isCacheable && cacheLabel) {
        return {
          ...item,
          label: cacheLabel,
        };
      }

      return item;
    });

    prevValuesRef.current = resultValues;
    return resultValues;
  }, [values]);

  return mergedValues;
}
