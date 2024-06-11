import * as React from 'react';
import type { RawValueType } from '../BaseSelect';
import type { DefaultOptionType, LabelInValueType } from '../Select';

/**
 * Cache `options` related LabeledValue & options.
 */
export default (
  labeledValues: LabelInValueType[],
  valueOptions: Map<RawValueType, DefaultOptionType>,
): [LabelInValueType[], (val: RawValueType) => DefaultOptionType] => {
  const cacheRef = React.useRef({
    options: new Map<RawValueType, DefaultOptionType>(),
  });

  const filledLabeledValues = React.useMemo(() => {
    const { options: prevOptionCache } = cacheRef.current;
    // Fill label by cache
    const patchedValues = labeledValues.map((item) => {
      if (item.label === undefined) {
        return {
          ...item,
          label: prevOptionCache.get(item.value)?.label,
        };
      }

      return item;
    });

    const optionCache = new Map<RawValueType, DefaultOptionType>();

    patchedValues.forEach((item) => {
      optionCache.set(item.value, valueOptions.get(item.value) || prevOptionCache.get(item.value));
    });

    cacheRef.current.options = optionCache;

    return patchedValues;
  }, [labeledValues, valueOptions]);

  const getOption = React.useCallback(
    (val: RawValueType) => valueOptions.get(val) || cacheRef.current.options.get(val),
    [valueOptions],
  );

  return [filledLabeledValues, getOption];
};
