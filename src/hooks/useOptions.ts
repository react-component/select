import * as React from 'react';
import type { FieldNames, RawValueType } from '../Select';
import { convertChildrenToData } from '../utils/legacyUtil';

/**
 * Parse `children` to `options` if `options` is not provided.
 * Then flatten the `options`.
 */
export default function useOptions<OptionType>(
  options: OptionType[],
  children: React.ReactNode,
  fieldNames: FieldNames,
  {
    optionFilterProp,
    optionLabelProp,
  }: {
    optionFilterProp: string;
    optionLabelProp: string;
  },
) {
  return React.useMemo(() => {
    let mergedOptions = options;
    const childrenAsData = !options;

    if (childrenAsData) {
      mergedOptions = convertChildrenToData(children);
    }

    const valueOptions = new Map<RawValueType, OptionType>();
    const labelOptions = new Map<React.ReactNode, OptionType>();

    function dig(optionList: OptionType[], isChildren = false) {
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNames.options] || isChildren) {
          valueOptions.set(option[fieldNames.value], option);
          if (option[fieldNames.label] && typeof option[fieldNames.label] === 'string') {
            labelOptions.set(option[fieldNames.label], option);
          }
          // https://github.com/ant-design/ant-design/issues/35304
          if (optionFilterProp && typeof optionFilterProp === 'string') {
            labelOptions.set(option[optionFilterProp], option);
          }
          if (optionLabelProp && typeof optionLabelProp === 'string') {
            labelOptions.set(option[optionLabelProp], option);
          }
        } else {
          dig(option[fieldNames.options], true);
        }
      }
    }
    dig(mergedOptions);

    return {
      options: mergedOptions,
      valueOptions,
      labelOptions,
    };
  }, [options, children, fieldNames]);
}
