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
import BaseSelect, { isMultiple } from './BaseSelect';
import type { DisplayValueType, RenderNode } from './BaseSelect';
import OptionList from './OptionList';
import Option from './Option';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from './BaseSelect';
import useOptions from './hooks/useOptions';
import SelectContext from './SelectContext';
import useId from './hooks/useId';
import useRefFunc from './hooks/useRefFunc';
import { fillFieldNames } from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { toArray } from './utils/commonUtil';

export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;
export interface LabelInValueType {
  label: React.ReactNode;
  value: RawValueType;
  /** @deprecated `key` is useless since it should always same as `value` */
  key?: React.Key;
}

export type DraftValueType =
  | RawValueType
  | LabelInValueType
  | DisplayValueType
  | (RawValueType | LabelInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

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
  /** @deprecated Use `searchValue` instead */
  inputValue?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // >>> Options
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionType>;
  optionFilterProp?: string;
  optionLabelProp?: string;
  children?: React.ReactNode;
  options?: OptionType[];
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;

  // >>> Icon
  menuItemSelectedIcon?: RenderNode;
}

export interface SingleRawSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode?: 'combobox';
  labelInValue?: false;
  value?: RawValueType | null;
  defaultValue?: RawValueType | null;
  onChange?: (value: RawValueType, option: OptionType) => void;
}

export interface SingleLabeledSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode?: 'combobox';
  labelInValue: true;
  value?: LabelInValueType | null;
  defaultValue?: LabelInValueType | null;
  onChange?: (value: LabelInValueType, option: OptionType) => void;
}

export interface MultipleRawSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode: 'multiple' | 'tags';
  labelInValue?: false;
  value?: RawValueType[] | null;
  defaultValue?: RawValueType[] | null;
  onChange?: (value: RawValueType[], option: OptionType[]) => void;
}

export interface MultipleLabeledSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends SharedSelectProps<OptionType> {
  mode: 'multiple' | 'tags';
  labelInValue: true;
  value?: LabelInValueType[] | null;
  defaultValue?: LabelInValueType[] | null;
  onChange?: (value: LabelInValueType[], option: OptionType[]) => void;
}

// TODO: Types test
export type SelectProps<OptionType extends BaseOptionType = DefaultOptionType> = Omit<
  | SingleRawSelectProps<OptionType>
  | SingleLabeledSelectProps<OptionType>
  | MultipleRawSelectProps<OptionType>
  | MultipleLabeledSelectProps<OptionType>,
  'onChange'
> & {
  onChange?: (value: DraftValueType, option: OptionType | OptionType[]) => void;
};

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

const Select = React.forwardRef((props: SelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    id,
    mode,
    prefixCls = 'rc-select',
    backfill,
    fieldNames,

    // Search
    inputValue,
    searchValue,
    onSearch,
    autoClearSearchValue = true,

    // Options
    filterOption,
    optionFilterProp = 'value',
    optionLabelProp,
    options,
    children,
    defaultActiveFirstOption,
    menuItemSelectedIcon,
    virtual,
    listHeight = 200,
    listItemHeight = 20,

    // Value
    value,
    defaultValue,
    labelInValue,
    onChange,
  } = props;

  const mergedId = useId(id);
  const multiple = isMultiple(mode);
  const childrenAsData = !!(!options && children);

  // ========================= FieldNames =========================
  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames, childrenAsData),
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      // We stringify fieldNames to avoid unnecessary re-renders.
      JSON.stringify(fieldNames),
      childrenAsData,
    ],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  // =========================== Search ===========================
  const [mergedSearchValue, setSearchValue] = useMergedState('', {
    value: searchValue !== undefined ? searchValue : inputValue,
    postState: (search) => search || '',
  });

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
    setSearchValue(searchText);

    if (onSearch && info.source !== 'blur') {
      onSearch(searchText);
    }
  };

  const onInternalSearchSplit: BaseSelectProps['onSearchSplit'] = (words) => {};

  React.useEffect(() => {
    if (mode === 'combobox' && isRawValue(value)) {
      setSearchValue(String(value));
    }
  }, [value]);

  // =========================== Option ===========================
  const parsedOptions = useOptions(options, children, mergedFieldNames);
  const { valueOptions, flattenOptions } = parsedOptions;

  const filteredOptions = React.useMemo(() => {
    if (!mergedSearchValue || filterOption === false) {
      return flattenOptions;
    }

    // Provide `filterOption`
    if (typeof filterOption === 'function') {
      return flattenOptions.filter((opt) => filterOption(mergedSearchValue, opt.data));
    }

    const upperSearch = mergedSearchValue.toUpperCase();
    return flattenOptions.filter((opt) =>
      toArray(opt.data[optionFilterProp]).join('').toUpperCase().includes(upperSearch),
    );
  }, [filterOption, flattenOptions, mergedSearchValue, optionFilterProp]);

  // ========================= Wrap Value =========================
  const convert2LabelValues = React.useCallback(
    (draftValues: DraftValueType) => {
      // Convert to array
      const valueList = toArray(draftValues);

      // Convert to labelInValue type
      return valueList.map((val) => {
        let rawValue: RawValueType;
        let rawLabel: React.ReactNode;
        let rawKey: React.Key;

        // Fill label & value
        if (isRawValue(val)) {
          rawValue = val;
        } else {
          rawValue = val.value;
          rawLabel = val.label;
          rawKey = val.key;
        }

        // If label is not provided, fill it
        if (rawLabel === undefined || rawKey === undefined) {
          const option = valueOptions.get(rawValue);
          if (rawLabel === undefined) rawLabel = option?.[mergedFieldNames.label];
          if (rawKey === undefined) rawKey = option?.key ?? rawValue;
        }

        return {
          label: rawLabel === undefined ? rawValue : rawLabel,
          value: rawValue,
          key: rawKey,
        };
      });
    },
    [mergedFieldNames, valueOptions],
  );

  // =========================== Values ===========================
  const [internalValue, setInternalValue] = useMergedState(defaultValue, {
    value,
  });

  // Merged value with LabelValueType
  const mergedValues = React.useMemo(
    () => convert2LabelValues(internalValue),
    [internalValue, convert2LabelValues],
  );

  /** Convert `displayValues` to raw value type set */
  const rawValues = React.useMemo(
    () => new Set(mergedValues.map((val) => val.value)),
    [mergedValues],
  );

  // =========================== Change ===========================
  const triggerChange = (values: DraftValueType) => {
    const labeledValues = convert2LabelValues(values);
    setInternalValue(labeledValues);

    if (onChange) {
      const returnValues = labelInValue ? labeledValues : labeledValues.map((v) => v.value);
      const returnOptions = labeledValues.map((v) => valueOptions.get(v.value));

      onChange(
        // Value
        multiple ? returnValues : returnValues[0],
        // Option
        multiple ? returnOptions : returnOptions[0],
      );
    }
  };

  // BaseSelect display values change
  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (nextValues, info) => {
    triggerChange(nextValues);
  };

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

  // ========================= OptionList =========================
  // Used for OptionList selection
  const onInternalSelect = useRefFunc<OnInternalSelect>((val, info) => {
    let cloneValues: (RawValueType | LabelInValueType)[];

    if (info.selected) {
      cloneValues = multiple ? [...mergedValues, val] : [val];
    } else {
      cloneValues = mergedValues.filter((v) => v.value !== val);
    }

    triggerChange(cloneValues);

    // Clean search value if single or configured
    if (mode === 'combobox') {
      // setSearchValue(String(newValue));
      setActiveValue('');
    } else if (!isMultiple || autoClearSearchValue) {
      setSearchValue('');
      setActiveValue('');
    }
  });

  // ========================== Context ===========================
  const selectContext = React.useMemo(
    () => ({
      ...parsedOptions,
      flattenOptions: filteredOptions,
      onActiveValue,
      defaultActiveFirstOption: mergedDefaultActiveFirstOption,
      onSelect: onInternalSelect,
      menuItemSelectedIcon,
      rawValues,
      fieldNames: mergedFieldNames,
      virtual,
      listHeight,
      listItemHeight,
      childrenAsData,
      optionLabelProp,
    }),
    [
      parsedOptions,
      filteredOptions,
      onActiveValue,
      mergedDefaultActiveFirstOption,
      onInternalSelect,
      menuItemSelectedIcon,
      rawValues,
      mergedFieldNames,
      virtual,
      listHeight,
      listItemHeight,
      childrenAsData,
      optionLabelProp,
    ],
  );

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningProps(props);
  }

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
        displayValues={mergedValues}
        onDisplayValuesChange={onDisplayValuesChange}
        // >>> Search
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        onSearchSplit={onInternalSearchSplit}
        // >>> OptionList
        OptionList={OptionList}
        emptyOptions={!filteredOptions.length}
        // >>> Accessibility
        activeValue={activeValue}
        activeDescendantId={`${id}_list_${accessibilityIndex}`}
      />
    </SelectContext.Provider>
  );
});

type SelectType = typeof Select;

const TypedSelect = Select as SelectType & {
  Option: typeof Option;
};

TypedSelect.Option = Option;

export default TypedSelect;
