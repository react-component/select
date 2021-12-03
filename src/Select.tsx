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
import BaseSelect, { DisplayValueType } from './BaseSelect';
import OptionList from './OptionList';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from './BaseSelect';
import useOptions from './hooks/useOptions';
import SelectContext from './SelectContext';
import useId from './hooks/useId';

export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type RawValueType = string | number;
export interface LabelInValueType {
  label: React.ReactNode;
  value: RawValueType;
}

export interface FieldNames {
  value?: string;
  label?: string;
  options?: string;
}

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export interface SharedSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends BaseSelectPropsWithoutPrivate {
  prefixCls?: string;
  id?: string;

  backfill?: boolean;

  // >>> Field Names
  fieldNames?: FieldNames;

  // >>> Search
  searchValue?: string;
  onSearch?: (value: string) => void;

  // >>> Options
  children?: React.ReactNode;
  options?: OptionType[];
  defaultActiveFirstOption?: boolean;
}

export interface SingleRawSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode?: 'combobox';
  value?: RawValueType | null;
}

export interface SingleLabeledSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode?: 'combobox';
  labelInValue: true;
  value?: LabelInValueType | null;
}

export interface MultipleRawSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode: 'multiple' | 'tags';
  value?: RawValueType[] | null;
}

export interface MultipleLabeledSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode: 'multiple' | 'tags';
  labelInValue: true;
  value?: LabelInValueType[] | null;
}

export type SelectProps<OptionType extends BaseOptionType = DefaultOptionType> =
  | SingleRawSelectProps<OptionType>
  | SingleLabeledSelectProps<OptionType>
  | MultipleRawSelectProps<OptionType>
  | MultipleLabeledSelectProps<OptionType>;

const Select = React.forwardRef((props: SelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    id,
    mode,
    prefixCls = 'rc-select',
    backfill,
    fieldNames,
    searchValue,
    options,
    children,
    defaultActiveFirstOption,
  } = props;

  const mergedId = useId(id);

  // =========================== Values ===========================
  const [displayValues, setDisplayValues] = React.useState<DisplayValueType[]>([]);

  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (nextValues, info) => {
    setDisplayValues(nextValues);
  };

  // =========================== Search ===========================
  const [mergedSearchValue] = useMergedState('', {
    value: searchValue,
  });

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {};

  const onInternalSearchSplit: BaseSelectProps['onSearchSplit'] = (words) => {};

  // ========================= OptionList =========================
  const flattenOptions = useOptions(options, children, fieldNames);

  // ======================= Accessibility ========================
  const [activeValue, setActiveValue] = React.useState<string>(null);
  const [accessibilityIndex, setAccessibilityIndex] = React.useState(0);
  const mergedDefaultActiveFirstOption =
    defaultActiveFirstOption !== undefined ? defaultActiveFirstOption : mode !== 'combobox';

  const onActiveValue: OnActiveValue = React.useCallback(
    (active, index, { source = 'keyboard' } = {}) => {
      setAccessibilityIndex(index);

      if (backfill && mode === 'combobox' && active !== null && source === 'keyboard') {
        setActiveValue(String(active));
      }
    },
    [backfill, mode],
  );

  // ========================== Context ===========================
  const selectContext = React.useMemo(
    () => ({
      ...flattenOptions,
      onActiveValue,
      defaultActiveFirstOption,
    }),
    [flattenOptions, onActiveValue, defaultActiveFirstOption],
  );

  // ==============================================================
  // ==                          Render                          ==
  // ==============================================================
  return (
    <SelectContext.Provider value={selectContext}>
      <BaseSelect
        {...props}
        // >>> MISC
        id={mergedId}
        prefixCls={prefixCls}
        ref={ref}
        // >>> Values
        displayValues={displayValues}
        onDisplayValuesChange={onDisplayValuesChange}
        // >>> Search
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        onSearchSplit={onInternalSearchSplit}
        // >>> OptionList
        OptionList={OptionList}
        // >>> Accessibility
        activeDescendantId={`${id}_list_${accessibilityIndex}`}
      />
    </SelectContext.Provider>
  );
});

export default Select;
