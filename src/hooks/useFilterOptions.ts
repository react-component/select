import * as React from 'react';
import { toArray } from '../utils/commonUtil';
import type { FieldNames, DefaultOptionType, SelectProps } from '../Select';
import { injectPropsWithOption } from '../utils/valueUtil';

function includes(test: React.ReactNode, search: string) {
  return toArray(test).join('').toUpperCase().includes(search);
}

export default (
  options: DefaultOptionType[],
  fieldNames: FieldNames,
  searchValue?: string,
  filterOption?: SelectProps['filterOption'],
  optionFilterProp?: string,
) =>
  React.useMemo(() => {
    if (!searchValue || filterOption === false) {
      return options;
    }

    const { options: fieldOptions, label: fieldLabel, value: fieldValue } = fieldNames;
    const filteredOptions: DefaultOptionType[] = [];

    const customizeFilter = typeof filterOption === 'function';

    const upperSearch = searchValue.toUpperCase();
    const filterFunc = customizeFilter
      ? filterOption
      : (_: string, option: DefaultOptionType) => {
          // Use provided `optionFilterProp`
          if (optionFilterProp) {
            return includes(option[optionFilterProp], upperSearch);
          }

          // Auto select `label` or `value` by option type
          if (option[fieldOptions]) {
            // hack `fieldLabel` since `OptionGroup` children is not `label`
            return includes(option[fieldLabel !== 'children' ? fieldLabel : 'label'], upperSearch);
          }

          return includes(option[fieldValue], upperSearch);
        };

    const wrapOption: (opt: DefaultOptionType) => DefaultOptionType = customizeFilter
      ? (opt) => injectPropsWithOption(opt)
      : (opt) => opt;

    options.forEach((item) => {
      // Group should check child options
      if (item[fieldOptions]) {
        // Check group first
        const matchGroup = filterFunc(searchValue, wrapOption(item));
        if (matchGroup) {
          filteredOptions.push(item);
        } else {
          // Check option
          const subOptions = item[fieldOptions].filter((subItem: DefaultOptionType) =>
            filterFunc(searchValue, wrapOption(subItem)),
          );
          if (subOptions.length) {
            filteredOptions.push({
              ...item,
              [fieldOptions]: subOptions,
            });
          }
        }

        return;
      }

      if (filterFunc(searchValue, wrapOption(item))) {
        filteredOptions.push(item);
      }
    });

    return filteredOptions;
  }, [options, filterOption, optionFilterProp, searchValue, fieldNames]);
