import * as React from 'react';
import type { FieldNames } from '../Select';
import { convertChildrenToData } from '../utils/legacyUtil';
import { flattenOptions } from '../utils/valueUtil';

/**
 * Parse `children` to `options` if `options` is not provided.
 * Then flatten the `options`.
 */
export default function useOptions<OptionType>(
  options: OptionType[],
  children: React.ReactNode,
  fieldNames: FieldNames,
) {
  return React.useMemo(() => {
    let mergedOptions = options;
    const childrenAsData = !options;

    if (childrenAsData) {
      mergedOptions = convertChildrenToData(children);
    }

    const [flattenedOptions, valueOptions, labelOptions] = flattenOptions(mergedOptions, {
      fieldNames,
      childrenAsData,
    });

    return {
      options: mergedOptions,
      flattenOptions: flattenedOptions,
      valueOptions,
      labelOptions,
    };
  }, [options, children, fieldNames]);
}
