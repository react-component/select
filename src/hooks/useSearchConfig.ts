import type { SearchConfig, DefaultOptionType } from '@/Select';
import * as React from 'react';

// Convert `showSearch` to unique config
export default function useSearchConfig(
  showSearch: boolean | SearchConfig<DefaultOptionType> | undefined,
  props: SearchConfig<DefaultOptionType>,
) {
  const {
    filterOption,
    searchValue,
    optionFilterProp,
    filterSort,
    onSearch,
    autoClearSearchValue,
  } = props;
  return React.useMemo<[boolean | undefined, SearchConfig<DefaultOptionType>]>(() => {
    const isObject = typeof showSearch === 'object';
    const searchConfig = {
      filterOption,
      searchValue,
      optionFilterProp,
      filterSort,
      onSearch,
      autoClearSearchValue,
      ...(isObject ? showSearch : {}),
    };

    return [isObject ? true : showSearch, searchConfig];
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
