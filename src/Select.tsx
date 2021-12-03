/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */

import * as React from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import BaseSelect from './BaseSelect';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from './BaseSelect';

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export interface SelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends BaseSelectPropsWithoutPrivate {
  prefixCls?: string;

  // >>> Search
  searchValue?: string;
  onSearch?: (value: string) => void;

  // >>> Options
  options: OptionType[];
}

const Select = React.forwardRef((props: SelectProps, ref: React.Ref<BaseSelectRef>) => {
  const { prefixCls = 'rc-select', searchValue } = props;

  // ======================= Search =======================
  const [mergedSearchValue] = useMergedState('', {
    value: searchValue,
  });

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {};

  const onSearchSplit: BaseSelectProps['onSearchSplit'] = (words) => {};

  // ======================= Render =======================
  return (
    <BaseSelect
      {...props}
      // >>> MISC
      prefixCls={prefixCls}
      ref={ref}
      // >>> Search
      searchValue={mergedSearchValue}
      onSearch={onInternalSearch}
    />
  );
});

export default Select;
