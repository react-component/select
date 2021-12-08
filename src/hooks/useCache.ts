import * as React from 'react';
import type { RawValueType } from '../BaseSelect';
import type { DefaultOptionType, LabelInValueType } from '../Select';

/**
 * Cache `value` related LabeledValue & options.
 */
export default (
  labeledValues: LabelInValueType[],
  valueOptions: Map<RawValueType, DefaultOptionType>,
): [LabelInValueType[], (val: RawValueType) => DefaultOptionType] => {
  const cacheRef = React.useRef({
    values: new Map<RawValueType, LabelInValueType>(),
    options: new Map<RawValueType, DefaultOptionType>(),
  });

  const filledLabeledValues = React.useMemo(() => {
    const { values: prevValueCache, options: prevOptionCache } = cacheRef.current;

    // Fill label by cache
    const patchedValues = labeledValues.map((item) => {
      if (item.label === undefined) {
        return {
          ...item,
          label: prevValueCache.get(item.value)?.label,
        };
      }

      return item;
    });

    // Refresh cache
    const valueCache = new Map<RawValueType, LabelInValueType>();
    const optionCache = new Map<RawValueType, DefaultOptionType>();

    patchedValues.forEach((item) => {
      valueCache.set(item.value, item);
      optionCache.set(item.value, valueOptions.get(item.value) || prevOptionCache.get(item.value));
    });

    cacheRef.current.values = valueCache;
    cacheRef.current.options = optionCache;

    return patchedValues;
  }, [labeledValues, valueOptions]);

  const getOption = React.useCallback(
    (val: RawValueType) => valueOptions.get(val) || cacheRef.current.options.get(val),
    [valueOptions],
  );

  return [filledLabeledValues, getOption];
};
