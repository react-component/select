import type { SearchConfig, DefaultOptionType, SelectProps } from '@/Select';
import * as React from 'react';

// Convert `showSearch` to unique config
export default function useSearchConfig(
  showSearch: boolean | SearchConfig<DefaultOptionType> | undefined,
  props: SelectProps,
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
    const legacyShowSearch: SearchConfig<DefaultOptionType> = {
      filterOption,
      searchValue,
      optionFilterProp,
      filterSort,
      onSearch,
      autoClearSearchValue,
    };

    if (showSearch === undefined || showSearch === true) {
      return [showSearch as undefined | boolean, legacyShowSearch];
    }
    if (!showSearch) {
      return [false, {}];
    }
    const searchConfig = {
      ...legacyShowSearch,
      ...showSearch,
    };
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
