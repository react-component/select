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
  } = props;
  return React.useMemo<[boolean | undefined, SearchConfig<DefaultOptionType>]>(() => {
    const searchConfig = {
      filterOption,
      searchValue,
      optionFilterProp,
      filterSort,
      onSearch,
      autoClearSearchValue,
      ...(typeof showSearch === 'object' ? showSearch : {}),
    };

    if (showSearch === false) {
      return [false, {}];
    }

    if (showSearch === undefined) {
      return [undefined, searchConfig];
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
