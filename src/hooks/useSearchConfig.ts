import type { SearchConfig, DefaultOptionType } from '@/Select';
import * as React from 'react';
const legacySearchProps = [
  'filterOption',
  'searchValue',
  'optionFilterProp',
  'optionLabelProp',
  'filterSort',
  'onSearch',
  'autoClearSearchValue',
  'tokenSeparators',
];
// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch, props) {
  return React.useMemo<[boolean, SearchConfig<DefaultOptionType>]>(() => {
    const legacyShowSearch: SearchConfig<DefaultOptionType> = {};
    legacySearchProps.forEach((propsName) => {
      legacyShowSearch[propsName] = props?.[propsName];
    });
    const searchConfig: SearchConfig<DefaultOptionType> =
      typeof showSearch === 'object' ? showSearch : legacyShowSearch;
    if (showSearch === undefined) {
      return [undefined, searchConfig];
    }
    if (!showSearch) {
      return [false, {}];
    }
    return [true, searchConfig];
  }, [
    showSearch,
    props?.filterOption,
    props?.searchValue,
    props?.optionFilterProp,
    props?.optionLabelProp,
    props?.filterSort,
    props?.onSearch,
    props?.autoClearSearchValue,
    props?.tokenSeparators,
  ]);
}
