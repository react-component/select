import type { SearchConfig, DefaultOptionType, SelectProps } from '../Select';
import * as React from 'react';

// Convert `showSearch` to unique config
export default function useSearchConfig(
  showSearch: boolean | SearchConfig<DefaultOptionType> | undefined,
  props: SearchConfig<DefaultOptionType>,
  mode: SelectProps<DefaultOptionType>['mode'],
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

    return [isObject || (!showSearch && mode === 'tags') ? true : showSearch, searchConfig];
  }, [
    mode,
    showSearch,
    filterOption,
    searchValue,
    optionFilterProp,
    filterSort,
    onSearch,
    autoClearSearchValue,
  ]);
}
