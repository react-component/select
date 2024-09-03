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

import useMergedState from 'rc-util/lib/hooks/useMergedState';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  DisplayInfoType,
  DisplayValueType,
  RenderNode,
} from './BaseSelect';
import BaseSelect, { isMultiple } from './BaseSelect';
import OptGroup from './OptGroup';
import Option from './Option';
import OptionList from './OptionList';
import SelectContext from './SelectContext';
import type { SelectContextProps } from './SelectContext';
import useCache from './hooks/useCache';
import useFilterOptions from './hooks/useFilterOptions';
import useId from './hooks/useId';
import useOptions from './hooks/useOptions';
import useRefFunc from './hooks/useRefFunc';
import type { FlattenOptionData } from './interface';
import { hasValue, isComboNoValue, toArray } from './utils/commonUtil';
import { fillFieldNames, flattenOptions, injectPropsWithOption } from './utils/valueUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

const OMIT_DOM_PROPS = ['inputValue'];

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
  groupLabel?: string;
  options?: string;
}

export interface BaseOptionType {
  disabled?: boolean;
  className?: string;
  title?: string;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label?: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType = DefaultOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;

type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface SelectProps<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType>
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

  // >>> Select
  onSelect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;
  onDeselect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;

  // >>> Options
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionType>;
  filterSort?: (optionA: OptionType, optionB: OptionType, info: { searchValue: string }) => number;
  optionFilterProp?: string;
  optionLabelProp?: string;
  children?: React.ReactNode;
  options?: OptionType[];
  optionRender?: (
    oriOption: FlattenOptionData<OptionType>,
    info: { index: number },
  ) => React.ReactNode;
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  direction?: 'ltr' | 'rtl';
  listHeight?: number;
  listItemHeight?: number;
  labelRender?: (props: LabelInValueType) => React.ReactNode;

  // >>> Icon
  menuItemSelectedIcon?: RenderNode;

  mode?: 'combobox' | 'multiple' | 'tags';
  labelInValue?: boolean;
  value?: ValueType | null;
  defaultValue?: ValueType | null;
  maxCount?: number;
  onChange?: (value: ValueType, option: OptionType | OptionType[]) => void;
}

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

const Select = React.forwardRef<BaseSelectRef, SelectProps<any, DefaultOptionType>>(
  (props, ref) => {
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

      // Select
      onSelect,
      onDeselect,
      dropdownMatchSelectWidth = true,

      // Options
      filterOption,
      filterSort,
      optionFilterProp,
      optionLabelProp,
      options,
      optionRender,
      children,
      defaultActiveFirstOption,
      menuItemSelectedIcon,
      virtual,
      direction,
      listHeight = 200,
      listItemHeight = 20,
      labelRender,

      // Value
      value,
      defaultValue,
      labelInValue,
      onChange,
      maxCount,

      ...restProps
    } = props;

    const mergedId = useId(id);
    const multiple = isMultiple(mode);
    const childrenAsData = !!(!options && children);

    const mergedFilterOption = React.useMemo(() => {
      if (filterOption === undefined && mode === 'combobox') {
        return false;
      }
      return filterOption;
    }, [filterOption, mode]);

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

    // =========================== Option ===========================
    const parsedOptions = useOptions(
      options,
      children,
      mergedFieldNames,
      optionFilterProp,
      optionLabelProp,
    );
    const { valueOptions, labelOptions, options: mergedOptions } = parsedOptions;

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
          let rawDisabled: boolean | undefined;
          let rawTitle: string;

          // Fill label & value
          if (isRawValue(val)) {
            rawValue = val;
          } else {
            rawKey = val.key;
            rawLabel = val.label;
            rawValue = val.value ?? (rawKey as RawValueType);
          }

          const option = valueOptions.get(rawValue);
          if (option) {
            // Fill missing props
            if (rawLabel === undefined)
              rawLabel = option?.[optionLabelProp || mergedFieldNames.label];
            if (rawKey === undefined) rawKey = option?.key ?? rawValue;
            rawDisabled = option?.disabled;
            rawTitle = option?.title;

            // Warning if label not same as provided
            if (process.env.NODE_ENV !== 'production' && !optionLabelProp) {
              const optionLabel = option?.[mergedFieldNames.label];
              if (
                optionLabel !== undefined &&
                !React.isValidElement(optionLabel) &&
                !React.isValidElement(rawLabel) &&
                optionLabel !== rawLabel
              ) {
                warning(false, '`label` of `value` is not same as `label` in Select options.');
              }
            }
          }

          return {
            label: rawLabel,
            value: rawValue,
            key: rawKey,
            disabled: rawDisabled,
            title: rawTitle,
          };
        });
      },
      [mergedFieldNames, optionLabelProp, valueOptions],
    );

    // =========================== Values ===========================
    const [internalValue, setInternalValue] = useMergedState(defaultValue, {
      value,
    });

    // Merged value with LabelValueType
    const rawLabeledValues = React.useMemo(() => {
      const newInternalValue = multiple && internalValue === null ? [] : internalValue;
      const values = convert2LabelValues(newInternalValue);

      // combobox no need save value when it's no value (exclude value equal 0)
      if (mode === 'combobox' && isComboNoValue(values[0]?.value)) {
        return [];
      }

      return values;
    }, [internalValue, convert2LabelValues, mode, multiple]);

    // Fill label with cache to avoid option remove
    const [mergedValues, getMixedOption] = useCache(rawLabeledValues, valueOptions);

    const displayValues = React.useMemo(() => {
      // `null` need show as placeholder instead
      // https://github.com/ant-design/ant-design/issues/25057
      if (!mode && mergedValues.length === 1) {
        const firstValue = mergedValues[0];
        if (
          firstValue.value === null &&
          (firstValue.label === null || firstValue.label === undefined)
        ) {
          return [];
        }
      }

      return mergedValues.map((item) => ({
        ...item,
        label: (typeof labelRender === 'function' ? labelRender(item) : item.label) ?? item.value,
      }));
    }, [mode, mergedValues, labelRender]);

    /** Convert `displayValues` to raw value type set */
    const rawValues = React.useMemo(
      () => new Set(mergedValues.map((val) => val.value)),
      [mergedValues],
    );

    React.useEffect(() => {
      if (mode === 'combobox') {
        const strValue = mergedValues[0]?.value;
        setSearchValue(hasValue(strValue) ? String(strValue) : '');
      }
    }, [mergedValues]);

    // ======================= Display Option =======================
    // Create a placeholder item if not exist in `options`
    const createTagOption = useRefFunc((val: RawValueType, label?: React.ReactNode) => {
      const mergedLabel = label ?? val;
      return {
        [mergedFieldNames.value]: val,
        [mergedFieldNames.label]: mergedLabel,
      } as DefaultOptionType;
    });

    // Fill tag as option if mode is `tags`
    const filledTagOptions = React.useMemo(() => {
      if (mode !== 'tags') {
        return mergedOptions;
      }

      // >>> Tag mode
      const cloneOptions = [...mergedOptions];

      // Check if value exist in options (include new patch item)
      const existOptions = (val: RawValueType) => valueOptions.has(val);

      // Fill current value as option
      [...mergedValues]
        .sort((a, b) => (a.value < b.value ? -1 : 1))
        .forEach((item) => {
          const val = item.value;

          if (!existOptions(val)) {
            cloneOptions.push(createTagOption(val, item.label));
          }
        });

      return cloneOptions;
    }, [createTagOption, mergedOptions, valueOptions, mergedValues, mode]);

    const filteredOptions = useFilterOptions(
      filledTagOptions,
      mergedFieldNames,
      mergedSearchValue,
      mergedFilterOption,
      optionFilterProp,
    );

    // Fill options with search value if needed
    const filledSearchOptions = React.useMemo(() => {
      if (
        mode !== 'tags' ||
        !mergedSearchValue ||
        filteredOptions.some((item) => item[optionFilterProp || 'value'] === mergedSearchValue)
      ) {
        return filteredOptions;
      }
      // ignore when search value equal select input value
      if (filteredOptions.some((item) => item[mergedFieldNames.value] === mergedSearchValue)) {
        return filteredOptions;
      }
      // Fill search value as option
      return [createTagOption(mergedSearchValue), ...filteredOptions];
    }, [
      createTagOption,
      optionFilterProp,
      mode,
      filteredOptions,
      mergedSearchValue,
      mergedFieldNames,
    ]);
    const sorter = (inputOptions: DefaultOptionType[]) => {
      const sortedOptions = [...inputOptions].sort((a, b) =>
        filterSort(a, b, { searchValue: mergedSearchValue }),
      );
      return sortedOptions.map((item) => {
        if (Array.isArray(item.options)) {
          return {
            ...item,
            options: item.options.length > 0 ? sorter(item.options) : item.options,
          };
        }
        return item;
      });
    };
    const orderedFilteredOptions = React.useMemo(() => {
      if (!filterSort) {
        return filledSearchOptions;
      }

      return sorter(filledSearchOptions);
    }, [filledSearchOptions, filterSort, mergedSearchValue]);

    const displayOptions = React.useMemo(
      () =>
        flattenOptions(orderedFilteredOptions, {
          fieldNames: mergedFieldNames,
          childrenAsData,
        }),
      [orderedFilteredOptions, mergedFieldNames, childrenAsData],
    );

    // =========================== Change ===========================
    const triggerChange = (values: DraftValueType) => {
      const labeledValues = convert2LabelValues(values);
      setInternalValue(labeledValues);

      if (
        onChange &&
        // Trigger event only when value changed
        (labeledValues.length !== mergedValues.length ||
          labeledValues.some((newVal, index) => mergedValues[index]?.value !== newVal?.value))
      ) {
        const returnValues = labelInValue ? labeledValues : labeledValues.map((v) => v.value);
        const returnOptions = labeledValues.map((v) =>
          injectPropsWithOption(getMixedOption(v.value)),
        );

        onChange(
          // Value
          multiple ? returnValues : returnValues[0],
          // Option
          multiple ? returnOptions : returnOptions[0],
        );
      }
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
    const triggerSelect = (val: RawValueType, selected: boolean, type?: DisplayInfoType) => {
      const getSelectEnt = (): [RawValueType | LabelInValueType, DefaultOptionType] => {
        const option = getMixedOption(val);
        return [
          labelInValue
            ? {
                label: option?.[mergedFieldNames.label],
                value: val,
                key: option?.key ?? val,
              }
            : val,
          injectPropsWithOption(option),
        ];
      };

      if (selected && onSelect) {
        const [wrappedValue, option] = getSelectEnt();
        onSelect(wrappedValue, option);
      } else if (!selected && onDeselect && type !== 'clear') {
        const [wrappedValue, option] = getSelectEnt();
        onDeselect(wrappedValue, option);
      }
    };

    // Used for OptionList selection
    const onInternalSelect = useRefFunc<OnInternalSelect>((val, info) => {
      let cloneValues: (RawValueType | DisplayValueType)[];

      // Single mode always trigger select only with option list
      const mergedSelect = multiple ? info.selected : true;

      if (mergedSelect) {
        cloneValues = multiple ? [...mergedValues, val] : [val];
      } else {
        cloneValues = mergedValues.filter((v) => v.value !== val);
      }

      triggerChange(cloneValues);
      triggerSelect(val, mergedSelect);

      // Clean search value if single or configured
      if (mode === 'combobox') {
        // setSearchValue(String(val));
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        setSearchValue('');
        setActiveValue('');
      }
    });

    // ======================= Display Change =======================
    // BaseSelect display values change
    const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (nextValues, info) => {
      triggerChange(nextValues);
      const { type, values } = info;

      if (type === 'remove' || type === 'clear') {
        values.forEach((item) => {
          triggerSelect(item.value, false, type);
        });
      }
    };

    // =========================== Search ===========================
    const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
      setSearchValue(searchText);
      setActiveValue(null);

      // [Submit] Tag mode should flush input
      if (info.source === 'submit') {
        const formatted = (searchText || '').trim();
        // prevent empty tags from appearing when you click the Enter button
        if (formatted) {
          const newRawValues = Array.from(new Set<RawValueType>([...rawValues, formatted]));
          triggerChange(newRawValues);
          triggerSelect(formatted, true);
          setSearchValue('');
        }

        return;
      }

      if (info.source !== 'blur') {
        if (mode === 'combobox') {
          triggerChange(searchText);
        }

        onSearch?.(searchText);
      }
    };

    const onInternalSearchSplit: BaseSelectProps['onSearchSplit'] = (words) => {
      let patchValues: RawValueType[] = words;

      if (mode !== 'tags') {
        patchValues = words
          .map((word) => {
            const opt = labelOptions.get(word);
            return opt?.value;
          })
          .filter((val) => val !== undefined);
      }

      const newRawValues = Array.from(new Set<RawValueType>([...rawValues, ...patchValues]));
      triggerChange(newRawValues);
      newRawValues.forEach((newRawValue) => {
        triggerSelect(newRawValue, true);
      });
    };

    // ========================== Context ===========================
    const selectContext = React.useMemo<SelectContextProps>(() => {
      const realVirtual = virtual !== false && dropdownMatchSelectWidth !== false;
      return {
        ...parsedOptions,
        flattenOptions: displayOptions,
        onActiveValue,
        defaultActiveFirstOption: mergedDefaultActiveFirstOption,
        onSelect: onInternalSelect,
        menuItemSelectedIcon,
        rawValues,
        fieldNames: mergedFieldNames,
        virtual: realVirtual,
        direction,
        listHeight,
        listItemHeight,
        childrenAsData,
        maxCount,
        optionRender,
      };
    }, [
      maxCount,
      parsedOptions,
      displayOptions,
      onActiveValue,
      mergedDefaultActiveFirstOption,
      onInternalSelect,
      menuItemSelectedIcon,
      rawValues,
      mergedFieldNames,
      virtual,
      dropdownMatchSelectWidth,
      direction,
      listHeight,
      listItemHeight,
      childrenAsData,
      optionRender,
    ]);

    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      warningProps(props);
      warningNullOptions(mergedOptions, mergedFieldNames);
    }

    // ==============================================================
    // ==                          Render                          ==
    // ==============================================================
    return (
      <SelectContext.Provider value={selectContext}>
        <BaseSelect
          {...restProps}
          // >>> MISC
          id={mergedId}
          prefixCls={prefixCls}
          ref={ref}
          omitDomProps={OMIT_DOM_PROPS}
          mode={mode}
          // >>> Values
          displayValues={displayValues}
          onDisplayValuesChange={onDisplayValuesChange}
          // >>> Trigger
          direction={direction}
          // >>> Search
          searchValue={mergedSearchValue}
          onSearch={onInternalSearch}
          autoClearSearchValue={autoClearSearchValue}
          onSearchSplit={onInternalSearchSplit}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          // >>> OptionList
          OptionList={OptionList}
          emptyOptions={!displayOptions.length}
          // >>> Accessibility
          activeValue={activeValue}
          activeDescendantId={`${mergedId}_list_${accessibilityIndex}`}
        />
      </SelectContext.Provider>
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  Select.displayName = 'Select';
}

const TypedSelect = Select as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(
  props: React.PropsWithChildren<SelectProps<ValueType, OptionType>> &
    React.RefAttributes<BaseSelectRef>,
) => React.ReactElement) & {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
};

TypedSelect.Option = Option;
TypedSelect.OptGroup = OptGroup;

export default TypedSelect;
