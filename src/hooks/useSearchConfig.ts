import type { SearchConfig, DefaultOptionType } from '@/Select';
import * as React from 'react';
const legacySearchProps = [
  'filterOption',
  'searchValue',
  'optionFilterProp',
  'filterSort',
  'onSearch',
  'autoClearSearchValue',
];
// Convert `showSearch` to unique config
export default function useSearchConfig(
  showSearch: boolean | SearchConfig<DefaultOptionType> | undefined,
  props: any,
) {
  const {
    filterOption,
    searchValue,
    optionFilterProp,
    filterSort,
    onSearch,
    autoClearSearchValue,
  } = props || {};
  return React.useMemo<[boolean | undefined, SearchConfig<DefaultOptionType>]>(() => {
    const legacyShowSearch: SearchConfig<DefaultOptionType> = {};
    legacySearchProps.forEach((name) => {
      const val = props?.[name];
      if (val !== undefined) legacyShowSearch[name] = val;
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
    filterOption,
    searchValue,
    optionFilterProp,
    filterSort,
    onSearch,
    autoClearSearchValue,
  ]);
}
