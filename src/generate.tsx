/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

import * as React from 'react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import useEffectAfterInit from './hooks/useEffectAfterInit';
import Selector, { RefSelectorProps } from './Selector';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import {
  RenderNode,
  Mode,
  RenderDOMFunc,
  OnActiveValue,
  OptionData,
  FlattenOptionData,
} from './interface';
import {
  GetLabeledValue,
  FilterOptions,
  FilterFunc,
  DefaultValueType,
  RawValueType,
  LabelValueType,
  Key,
  RefSelectFunc,
  DisplayLabelValueType,
  FlattenOptionsType,
  SingleType,
  OnClear,
  INTERNAL_PROPS_MARK,
  SelectSource,
  CustomTagProps,
} from './interface/generator';
import { OptionListProps, RefOptionListProps } from './OptionList';
import { toOuterValues, removeLastEnabledValue, getUUID } from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import useLayoutEffect from './hooks/useLayoutEffect';
import { getSeparatedContent } from './utils/valueUtil';
import useCacheDisplayValue from './hooks/useCacheDisplayValue';

const DEFAULT_OMIT_PROPS = [
  'removeIcon',
  'placeholder',
  'autoFocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'className',
  'open',
  'defaultOpen',
  'options',
  'value',
  'inputValue',
  'searchValue',
  'showArrow',
  'optionLabelProp',
  'labelInValue',
  'optionSearchLabelProp',
  'allowSearchLabelOnly',
];

export interface RefSelectProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectProps<OptionsType extends object[], ValueType> extends React.AriaAttributes {
  prefixCls?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // Options
  options?: OptionsType;
  children?: React.ReactNode;
  mode?: Mode;

  // Value
  value?: ValueType;
  defaultValue?: ValueType;
  labelInValue?: boolean;

  // Search
  inputValue?: string;
  searchValue?: string;
  optionFilterProp?: string;
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionsType[number]>;
  filterSort?: (optionA: OptionsType[number], optionB: OptionsType[number]) => number;
  showSearch?: boolean;
  autoClearSearchValue?: boolean;
  onSearch?: (value: string) => void;
  onClear?: OnClear;

  // Icons
  allowClear?: boolean;
  clearIcon?: React.ReactNode;
  showArrow?: boolean;
  inputIcon?: RenderNode;
  removeIcon?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;

  // Dropdown
  open?: boolean;
  defaultOpen?: boolean;
  listHeight?: number;
  listItemHeight?: number;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  virtual?: boolean;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  dropdownAlign?: any;
  animation?: string;
  transitionName?: string;
  getPopupContainer?: RenderDOMFunc;
  direction?: string;

  // Others
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  placeholder?: React.ReactNode;
  backfill?: boolean;
  getInputElement?: () => JSX.Element;
  optionSearchLabelProp?: string;
  allowSearchLabelOnly?: boolean;
  optionLabelProp?: string;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  showAction?: ('focus' | 'click')[];
  tabIndex?: number;

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onDropdownVisibleChange?: (open: boolean) => void;
  onSelect?: (value: SingleType<ValueType>, option: OptionsType[number]) => void;
  onDeselect?: (value: SingleType<ValueType>, option: OptionsType[number]) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler;
  onChange?: (value: ValueType, option: OptionsType[number] | OptionsType) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;

  // Motion
  choiceTransitionName?: string;

  // Internal props
  /**
   * Only used in current version for internal event process.
   * Do not use in production environment.
   */
  internalProps?: {
    mark?: string;
    onClear?: OnClear;
    skipTriggerChange?: boolean;
    skipTriggerSelect?: boolean;
    onRawSelect?: (value: RawValueType, option: OptionsType[number], source: SelectSource) => void;
    onRawDeselect?: (
      value: RawValueType,
      option: OptionsType[number],
      source: SelectSource,
    ) => void;
  };
}

export interface GenerateConfig<OptionsType extends object[]> {
  prefixCls: string;
  components: {
    optionList: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<
        Omit<OptionListProps<OptionsType>, 'options'> & { options: OptionsType }
      > &
        React.RefAttributes<RefOptionListProps>
    >;
  };
  /** Convert jsx tree into `OptionsType` */
  convertChildrenToData: (children: React.ReactNode) => OptionsType;
  /** Flatten nest options into raw option list */
  flattenOptions: (options: OptionsType) => FlattenOptionsType<OptionsType>;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<FlattenOptionsType<OptionsType>>;
  filterOptions: FilterOptions<OptionsType>;
  findValueOption: // Need still support legacy ts api
    | ((values: RawValueType[], options: FlattenOptionsType<OptionsType>) => OptionsType)
    | (( // New API add prevValueOptions support
        values: RawValueType[],
        options: FlattenOptionsType<OptionsType>,
        info?: { prevValueOptions?: OptionsType[] },
      ) => OptionsType);
  /** Check if a value is disabled */
  isValueDisabled: (value: RawValueType, options: FlattenOptionsType<OptionsType>) => boolean;
  warningProps?: (props: any) => void;
  omitDOMProps?: (props: object) => object;
}

/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */
export default function generateSelector<
  OptionsType extends {
    value?: RawValueType;
    label?: React.ReactNode;
    key?: Key;
    disabled?: boolean;
  }[]
>(config: GenerateConfig<OptionsType>) {
  const {
    prefixCls: defaultPrefixCls,
    components: { optionList: OptionList },
    convertChildrenToData,
    flattenOptions,
    getLabeledValue,
    filterOptions,
    isValueDisabled,
    findValueOption,
    warningProps,
    omitDOMProps,
  } = config;

  // Use raw define since `React.FC` not support generic
  function Select<ValueType extends DefaultValueType>(
    props: SelectProps<OptionsType, ValueType>,
    ref: React.Ref<RefSelectProps>,
  ): React.ReactElement {
    const {
      prefixCls = defaultPrefixCls,
      id,

      labelInValue,
      children,

      mode,

      // Search related
      showSearch,
      filterOption,
      filterSort,
      optionFilterProp = 'value',
      autoClearSearchValue = true,
      onSearch,

      // Icons
      allowClear,
      clearIcon,
      inputIcon,
      menuItemSelectedIcon,

      // Others
      disabled,
      loading,
      defaultActiveFirstOption,
      notFoundContent = 'Not Found',
      backfill,
      getInputElement,
      getPopupContainer,

      // Dropdown
      listHeight = 200,
      listItemHeight = 20,
      animation,
      transitionName,
      virtual,
      dropdownStyle,
      dropdownClassName,
      dropdownMatchSelectWidth,
      dropdownRender,
      dropdownAlign,
      showAction = [],
      direction,

      // Tags
      tokenSeparators,
      tagRender,

      // Events
      onPopupScroll,
      onDropdownVisibleChange,
      onFocus,
      onBlur,
      onKeyUp,
      onKeyDown,
      onMouseDown,

      onChange,
      onSelect,
      onDeselect,
      onClear,

      internalProps = {},

      ...restProps
    } = props;

    const useInternalProps = internalProps.mark === INTERNAL_PROPS_MARK;

    const domProps = omitDOMProps ? omitDOMProps(restProps) : restProps;
    DEFAULT_OMIT_PROPS.forEach(prop => {
      delete domProps[prop];
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<RefTriggerProps>(null);
    const selectorRef = useRef<RefSelectorProps>(null);
    const listRef = useRef<RefOptionListProps>(null);

    const tokenWithEnter = useMemo(
      () => (tokenSeparators || []).some(tokenSeparator => ['\n', '\r\n'].includes(tokenSeparator)),
      [tokenSeparators],
    );

    /** Used for component focused management */
    const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

    // Inner id for accessibility usage. Only work in client side
    const [innerId, setInnerId] = useState<string>();
    useEffect(() => {
      setInnerId(`rc_select_${getUUID()}`);
    }, []);
    const mergedId = id || innerId;

    // optionLabelProp
    const optionLabelProp = [props.optionLabelProp, props.options ? 'label' : 'children'].find(
      x => x !== undefined,
    );

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const mergedShowSearch =
      showSearch !== undefined ? showSearch : isMultiple || mode === 'combobox';

    const usesSearchLabels = mode === 'combobox';

    const allowSearchLabelOnly =
      props.allowSearchLabelOnly !== undefined ? props.allowSearchLabelOnly : false;

    const optionSearchLabelProp =
      props.optionSearchLabelProp !== undefined ? props.optionSearchLabelProp : 'value';

    // ============================== Ref ===============================
    const selectorDomRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      focus: selectorRef.current.focus,
      blur: selectorRef.current.blur,
    }));

    // Set by option list active, it will merge into search input when mode is `combobox`
    const [activeValue, setActiveValue] = useState<string>(null);

    function convertToSelectedOption(
      selectedOptionData?: object | number | string,
    ): OptionData | undefined {
      if (selectedOptionData === null) {
        return {
          value: null,
          label: '',
        };
      }
      if (typeof selectedOptionData === 'string' || typeof selectedOptionData === 'number') {
        return {
          value: selectedOptionData,
          label: selectedOptionData,
          [optionSearchLabelProp]: selectedOptionData,
        };
      }
      if (typeof selectedOptionData === 'object') {
        const result = { ...selectedOptionData } as OptionData;
        if (!('value' in result) && 'key' in result) {
          result.value = result.key;
        }
        if (optionLabelProp in result) {
          result.label = result[optionLabelProp];
        }
        return result;
      }
      return undefined;
    }

    // ============================= Value ==============================

    const [requestedSearchValue, requestSetSearchValue] = useState(undefined);
    const searchValue = (() => {
      if (mode === 'combobox' && props.value === null) return '';

      return [
        usesSearchLabels
          ? (convertToSelectedOption(props.value) || {})[optionSearchLabelProp]
          : undefined,
        props.searchValue,
        props.inputValue,
        requestedSearchValue,
      ].find(x => x !== undefined);
    })();

    const providedOptionsData: OptionsType = useMemo(() => {
      const result =
        props.options !== undefined ? props.options : convertChildrenToData(props.children);

      return result !== null ? result : ([] as OptionsType);
    }, [props.options, props.children]);

    const [requestedSelectedOptions, requestSetSelectedOptions] = useState<OptionData[]>(undefined);
    const selectedOptions: OptionData[] = useMemo(() => {
      let selectedOptionsData = [
        props.value,
        requestedSelectedOptions,
        props.defaultValue,
        [],
      ].find(x => x !== undefined) as (OptionData | OptionData[]);
      if (!Array.isArray(selectedOptionsData)) {
        selectedOptionsData = [selectedOptionsData];
      }
      return selectedOptionsData.map(data => convertToSelectedOption(data));
    }, [props.value, requestedSelectedOptions, props.defaultValue]);

    const rawValue = useMemo<RawValueType[]>(() => {
      // Code for debatable expected behavior for unit test:
      // "Select.Combobox should hide clear icon when value is ''"
      // This means that the empty string cannot be itself a value that could be cleared
      // to default back to the value provided by `defaultValue`
      if (mode === 'combobox' && selectedOptions.length && selectedOptions[0].value === '') {
        return [];
      }

      return selectedOptions.map(({ key, value }) =>
        [value, key].find(x => x !== undefined),
      ) as RawValueType[];
    }, [selectedOptions]);

    const selectedOptionSearchLabel: string | undefined = useMemo(() => {
      if (usesSearchLabels) {
        if (selectedOptions.length) {
          const selectedOption = selectedOptions[0];
          return String(selectedOption[optionSearchLabelProp]);
        }
      }
      return undefined;
    }, [usesSearchLabels, selectedOptions, optionSearchLabelProp]);

    /** We cache a set of raw values to speed up check */
    const rawValues = useMemo<Set<RawValueType>>(() => new Set(rawValue), [rawValue]);

    const selectedOptionsMap: Map<RawValueType, OptionData> = useMemo(() => {
      const map = new Map();
      selectedOptions.forEach(selectedOption => {
        map.set(selectedOption.value, selectedOption);
      });
      return map;
    }, [selectedOptions]);

    const providedSelectableOptionsMap: Map<RawValueType, FlattenOptionData> = useMemo(() => {
      const map = new Map();
      flattenOptions(providedOptionsData)
        .filter(flattenedOption => !flattenedOption.group)
        .forEach(flattenedOption => {
          map.set(flattenedOption.data.value, flattenedOption);
        });
      return map;
    }, [providedOptionsData]);

    const options: OptionsType = useMemo(() => {
      if (mode === 'tags') {
        const result = [...providedOptionsData] as OptionsType;
        // For all selected option values that do not have a corresponding selectable option,
        // add selectable options (in alphabetical order) for these values to the end/bottom
        // of the options data
        [...rawValues].sort().forEach(value => {
          if (!providedSelectableOptionsMap.has(value)) {
            result.push({
              value,
            });
          }
        });
        return result;
      }

      return providedOptionsData;
    }, [providedOptionsData, providedSelectableOptionsMap, props.mode, rawValues]);

    const mergedFlattenOptions: FlattenOptionsType<OptionsType> = useMemo(
      () => flattenOptions(options),
      [options],
    );

    const selectableOptionsMap: Map<RawValueType, FlattenOptionData> = useMemo(() => {
      const map = new Map();
      mergedFlattenOptions
        .filter(flattenedOption => !flattenedOption.group)
        .forEach(flattenedOption => {
          map.set(flattenedOption.data.value, flattenedOption);
        });
      return map;
    }, [mergedFlattenOptions]);

    const getValueOption = (someRawValues: RawValueType[]) =>
      someRawValues.map(value => selectableOptionsMap.get(value)).filter(Boolean);

    // Display options for OptionList
    const displayOptions = useMemo<OptionsType>(() => {
      if (!searchValue || !mergedShowSearch) {
        return [...options] as OptionsType;
      }
      const filteredOptions: OptionsType = filterOptions(searchValue, options, {
        optionFilterProp,
        filterOption: mode === 'combobox' && filterOption === undefined ? () => true : filterOption,
      });
      if (mode === 'tags' && filteredOptions.every(opt => opt[optionFilterProp] !== searchValue)) {
        filteredOptions.unshift({
          value: searchValue,
          label: searchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }
      if (filterSort && Array.isArray(filteredOptions)) {
        return ([...filteredOptions] as OptionsType).sort(filterSort);
      }

      return filteredOptions;
    }, [options, searchValue, mode, mergedShowSearch, filterSort]);

    const displayFlattenOptions: FlattenOptionsType<OptionsType> = useMemo(
      () => flattenOptions(displayOptions),
      [displayOptions],
    );

    useEffect(() => {
      if (listRef.current && listRef.current.scrollTo) {
        listRef.current.scrollTo(0);
      }
    }, [searchValue]);

    // ============================ Selector ============================

    // Keep track of whether the selector has received focus yet so that the
    // `onSearch` doesn't get called before search is possible by the user
    const [selectorHasFocused, setSelectorHasFocused] = useState<boolean>(false);
    const onSelectorFocus = () => setSelectorHasFocused(true);

    const selectableDisplayOptionsMap: Map<RawValueType, FlattenOptionData> = useMemo(() => {
      const map = new Map();
      displayFlattenOptions
        .filter(flattenedOption => !flattenedOption.group)
        .forEach(flattenedOption => {
          map.set(flattenedOption.data.value, flattenedOption);
        });
      return map;
    }, [displayFlattenOptions]);

    // ======================== Stashed Option ========================
    const [searchValueSelectsCurrentSelection, setSearchValueSelectsCurrentSelection] = useState<
      boolean
    >(false);

    const [stashedOption, setStashedOption] = useState<{
      data?: any;
      isStashed: boolean;
      isReadyToApply: boolean;
    }>({
      data: null,
      isStashed: false,
      isReadyToApply: false,
    });

    const hasStashedOption: boolean = stashedOption.isStashed;

    const stashOption = () => {
      if (!hasStashedOption) {
        setStashedOption({
          data: requestedSelectedOptions,
          isStashed: true,
          isReadyToApply: false,
        });
        requestSetSelectedOptions(undefined);
      }
    };

    const removeStashedOption = () => setStashedOption({ isStashed: false, isReadyToApply: false });

    const applyStashedOption = () => {
      if (hasStashedOption) {
        requestSetSelectedOptions(stashedOption.data);
        setStashedOption({
          ...stashedOption,
          isReadyToApply: true,
        });
      }
    };

    const getSelectedOptionsDataFromRawValues = newRawValues =>
      newRawValues
        .map(rawVal => {
          if (rawVal === undefined) return undefined;

          // Attempt to find option data for the provided raw value, first from the options already
          // selected, then from the selectable display options
          const option =
            selectedOptionsMap.get(rawVal) || (selectableDisplayOptionsMap.get(rawVal) || {}).data;

          // If the option data is found, use it
          if (option) {
            return option;
          }

          // Otherwise, create the option data as expected
          return toOuterValues([rawVal], {
            labelInValue,
            options: getValueOption([rawVal]),
            getLabeledValue,
            prevValue: selectedOptions,
            optionLabelProp,
          })[0] as OptionData;
        })
        .filter(Boolean);

    let displayValues = useMemo<DisplayLabelValueType[]>(() => {
      const tmpValues: DisplayLabelValueType[] = rawValue.map((val: RawValueType) => {
        const valueOptions = getValueOption([val]);

        const displayValue = getLabeledValue(val, {
          options: valueOptions,
          prevValue: selectedOptions,
          labelInValue,
          optionLabelProp,
        });

        return {
          ...displayValue,
          disabled: isValueDisabled(val, valueOptions),
        };
      });

      if (
        !mode &&
        tmpValues.length === 1 &&
        tmpValues[0].value === null &&
        tmpValues[0].label === null
      ) {
        return [];
      }

      return tmpValues;
    }, [selectedOptions, options, mode, rawValue]);

    // Polyfill with cache label
    displayValues = useCacheDisplayValue(displayValues);

    const triggerSelect = (newValue: RawValueType, isSelect: boolean, source: SelectSource) => {
      const newValueOption = getValueOption([newValue]);
      const outOption = findValueOption([newValue], newValueOption)[0];

      if (!internalProps.skipTriggerSelect) {
        // Skip trigger `onSelect` or `onDeselect` if configured
        const selectValue = (labelInValue
          ? getLabeledValue(newValue, {
              options: newValueOption,
              prevValue: selectedOptions,
              labelInValue,
              optionLabelProp,
            })
          : newValue) as SingleType<ValueType>;

        if (isSelect && onSelect) {
          onSelect(selectValue, outOption);
        } else if (!isSelect && onDeselect) {
          onDeselect(selectValue, outOption);
        }
      }

      // Trigger internal event
      if (useInternalProps) {
        if (isSelect && internalProps.onRawSelect) {
          internalProps.onRawSelect(newValue, outOption, source);
        } else if (!isSelect && internalProps.onRawDeselect) {
          internalProps.onRawDeselect(newValue, outOption, source);
        }
      }
    };

    // We need cache options here in case user update the option list
    const [prevValueOptions, setPrevValueOptions] = useState([]);

    const triggerChange = (newRawValues: RawValueType[], fromSearching = false) => {
      if (useInternalProps && internalProps.skipTriggerChange) {
        return;
      }
      const newRawValuesOptions = getValueOption(newRawValues);
      const outValues = toOuterValues<FlattenOptionsType<OptionsType>>(Array.from(newRawValues), {
        labelInValue,
        options: newRawValuesOptions,
        getLabeledValue,
        prevValue: selectedOptions,
        optionLabelProp,
      });

      const selectedOptionsData = getSelectedOptionsDataFromRawValues(Array.from(newRawValues));

      const outValue: ValueType = (isMultiple ? outValues : outValues[0]) as ValueType;
      // Skip trigger if prev & current value is both empty
      if (onChange && (rawValue.length !== 0 || outValues.length !== 0)) {
        const outOptions = findValueOption(newRawValues, newRawValuesOptions, { prevValueOptions });

        // We will cache option in case it removed by ajax
        setPrevValueOptions(
          outOptions.map((option, index) => {
            const clone = { ...option };
            Object.defineProperty(clone, '_INTERNAL_OPTION_VALUE_', {
              get: () => newRawValues[index],
            });
            return clone;
          }),
        );

        onChange(outValue, isMultiple ? outOptions : outOptions[0]);
      }

      if (!fromSearching) {
        requestSetSelectedOptions(selectedOptionsData);
      }
    };

    // Whenever the most recently selected option's search label changes (and when search labels are
    // being used) and the current search value is undefined, update the search value with the
    // selected option's search label while indicating that the search value now selects the
    // currently selected option.
    useEffect(() => {
      if (
        usesSearchLabels &&
        searchValue === undefined &&
        selectedOptionSearchLabel !== undefined
      ) {
        requestSetSearchValue(selectedOptionSearchLabel);
        setSearchValueSelectsCurrentSelection(true);
      }
    }, [searchValue, selectedOptions, selectedOptionSearchLabel]);

    // Whenever the search value changes, determine whether this would deselect the currently
    // selected option
    useEffect(() => {
      if (usesSearchLabels && searchValue !== undefined) {
        // When there is a previously selected option stashed, don't manage the search value
        if (!hasStashedOption) {
          if (searchValueSelectsCurrentSelection && searchValue !== selectedOptionSearchLabel) {
            // Store the previously selected option to return to it later upon hitting Escape within
            // the search textbox
            stashOption();

            setSearchValueSelectsCurrentSelection(false);
          }
        }
      }
    }, [
      usesSearchLabels,
      searchValue,
      hasStashedOption,
      searchValueSelectsCurrentSelection,
      selectedOptionSearchLabel,
    ]);

    // Whenever the selected options change, attempt to update the search value with a search label
    // to indicate the newly selected option or an empty string if circumstances require it
    useEffect(() => {
      if (usesSearchLabels && searchValue !== undefined) {
        // When there is a previously selected option stashed, don't manage the search value
        if (!hasStashedOption) {
          requestSetSearchValue(selectedOptionSearchLabel);
          setSearchValueSelectsCurrentSelection(true);
        }
      }
    }, [selectedOptions, hasStashedOption, selectedOptionSearchLabel]);

    const onInternalSelect = (
      newValue: RawValueType,
      { selected, source }: { selected: boolean; source: SelectSource },
    ) => {
      let newRawValue: Set<RawValueType>;

      if (isMultiple) {
        newRawValue = new Set(rawValue);
        if (selected) {
          newRawValue.add(newValue);
        } else {
          newRawValue.delete(newValue);
        }
      } else {
        newRawValue = new Set();
        newRawValue.add(newValue);
      }

      // Multiple always trigger change and single should change if value changed
      if (isMultiple || (!isMultiple && Array.from(rawValue)[0] !== newValue)) {
        triggerChange(Array.from(newRawValue));
      }

      // Trigger `onSelect`. Single mode always trigger select
      triggerSelect(newValue, !isMultiple || selected, source);

      // Clean search value if single or configured
      if (usesSearchLabels) {
        const pendingNewSelectedOptions = getSelectedOptionsDataFromRawValues(
          Array.from(newRawValue),
        );
        requestSetSearchValue(
          pendingNewSelectedOptions.length
            ? pendingNewSelectedOptions[0][optionSearchLabelProp]
            : newValue,
        );
        setSearchValueSelectsCurrentSelection(true);
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        requestSetSearchValue('');
        setActiveValue('');
      }

      removeStashedOption();
    };

    const onInternalOptionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'option' });
    };

    const onInternalSelectionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'selection' });
    };

    useEffect(() => {
      // Complete the last part of applying the stashed option
      if (stashedOption.isReadyToApply) {
        onInternalSelect(selectedOptions.length ? selectedOptions[0].value : undefined, {
          selected: true,
          source: 'stash',
        });
      }
    }, [stashedOption.isReadyToApply]);

    // ============================= Input ==============================
    // Only works in `combobox`
    const customizeInputElement: React.ReactElement =
      (mode === 'combobox' && getInputElement && getInputElement()) || null;

    // ============================== Open ==============================
    const [requestedIsDropdownVisible, requestSetIsDropdownVisible] = useState<boolean>(undefined);
    const isDropdownEmpty: boolean = !notFoundContent && !displayOptions.length;
    const dropdownVisibilityAllowed: boolean = !props.disabled && !isDropdownEmpty;
    const isDropdownVisible: boolean = (() => {
      let result = [props.open, requestedIsDropdownVisible, props.defaultOpen].find(
        x => x !== undefined,
      );
      if (!dropdownVisibilityAllowed) {
        result = false;
      }
      return result;
    })();

    // Handle when an ajax response is received that subsequently allows dropdown visibility
    useEffect(() => {
      if (requestedIsDropdownVisible && dropdownVisibilityAllowed) {
        requestSetIsDropdownVisible(true);
      }
    }, [requestedIsDropdownVisible, dropdownVisibilityAllowed]);

    // Setup the "onDropdownVisibleChange" event handler
    useEffectAfterInit(() => {
      if (onDropdownVisibleChange) {
        onDropdownVisibleChange(requestedIsDropdownVisible);
      }
    }, [requestedIsDropdownVisible]);

    // When click events outside of the component, attempt toggling the dropdown's visibility
    useEffect(() => {
      const elements = [
        containerRef.current,
        triggerRef.current && triggerRef.current.getPopupElement(),
      ].filter(e => e);

      function onGlobalClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const isClickOutsideElements = elements.every(
          element => !element.contains(target) && element !== target,
        );

        if (isDropdownVisible && isClickOutsideElements) {
          requestSetIsDropdownVisible(false);
        }
      }

      window.addEventListener('mousedown', onGlobalClick);
      return () => window.removeEventListener('mousedown', onGlobalClick);
    }, [isDropdownVisible]);

    // ============================= Search =============================
    const triggerSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
      let result = true;
      let newSearchText = searchText;
      setActiveValue(null);

      if (mode === 'combobox') {
        // Only typing will trigger onChange
        if (fromTyping) {
          triggerChange([newSearchText], true);
        }
      } else if (!isCompositing) {
        // Check if match the `tokenSeparators`
        const patchLabels: string[] = getSeparatedContent(searchText, tokenSeparators);

        if (patchLabels) {
          let patchRawValues: RawValueType[] = patchLabels;

          newSearchText = '';

          if (mode !== 'tags') {
            patchRawValues = patchLabels
              .map(label => {
                const item = mergedFlattenOptions.find(
                  ({ data }) => data[optionLabelProp] === label,
                );
                return item ? item.data.value : null;
              })
              .filter((val: RawValueType) => val !== null);
          }

          const newRawValues = Array.from(new Set<RawValueType>([...rawValue, ...patchRawValues]));
          requestSetSelectedOptions(newRawValues.map(data => convertToSelectedOption(data)));
          triggerChange(newRawValues);
          newRawValues.forEach(newRawValue => {
            triggerSelect(newRawValue, true, 'input');
          });

          // Should close when paste finish
          requestSetIsDropdownVisible(false);

          // Tell Selector that break next actions
          result = false;
        }
      }

      requestSetSearchValue(newSearchText);

      // Handle "onSearch" event handler when the search value changes,
      // but only after the selector has been focused for the first time
      if (onSearch && selectorHasFocused && searchValue !== newSearchText) {
        onSearch(newSearchText);
      }

      return result;
    };

    // Only triggered when menu is closed & mode is tags
    // If menu is open, OptionList will take charge
    // If mode isn't tags, press enter is not meaningful when you can't see any option
    const onSearchSubmit = (searchText: string) => {
      const newRawValues = Array.from(new Set<RawValueType>([...rawValue, searchText]));
      triggerChange(newRawValues);
      newRawValues.forEach(newRawValue => {
        triggerSelect(newRawValue, true, 'input');
      });
      requestSetSearchValue('');
    };

    // Handle when the Escape key is pressed while the search input textbox was selected
    const onEscapeSearchInput = useCallback(() => {
      if (usesSearchLabels && hasStashedOption) {
        applyStashedOption();
      }
    }, [usesSearchLabels, hasStashedOption]);

    // Close dropdown when disabled change
    useEffect(() => {
      if (props.disabled) {
        requestSetIsDropdownVisible(false);
      }
    }, [props.disabled]);

    // Close will clean up single mode search text
    useEffect(() => {
      if (!isDropdownVisible && !isMultiple && mode !== 'combobox') {
        triggerSearch('', false, false);
      }
    }, [isDropdownVisible]);

    // ============================ Keyboard ============================
    /**
     * We record input value here to check if can press to clean up by backspace
     * - null: Key is not down, this is reset by key up
     * - true: Search text is empty when first time backspace down
     * - false: Search text is not empty when first time backspace down
     */
    const [getClearLock, setClearLock] = useLock();

    // KeyDown
    const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
      const clearLock = getClearLock();
      const { which } = event;

      // We only manage open state here, close logic should handle by list component
      if (!isDropdownVisible && which === KeyCode.ENTER) {
        requestSetIsDropdownVisible(true);
      }

      setClearLock(!!searchValue);

      // Remove value by `backspace`
      if (
        which === KeyCode.BACKSPACE &&
        !clearLock &&
        isMultiple &&
        !searchValue &&
        rawValue.length
      ) {
        const removeInfo = removeLastEnabledValue(displayValues, rawValue);

        if (removeInfo.removedValue !== null) {
          triggerChange(removeInfo.values);
          triggerSelect(removeInfo.removedValue, false, 'input');
        }
      }

      if (isDropdownVisible && listRef.current) {
        listRef.current.onKeyDown(event, ...rest);
      }

      if (onKeyDown) {
        onKeyDown(event, ...rest);
      }
    };

    // KeyUp
    const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
      if (isDropdownVisible && listRef.current) {
        listRef.current.onKeyUp(event, ...rest);
      }

      if (onKeyUp) {
        onKeyUp(event, ...rest);
      }
    };

    // ========================== Focus / Blur ==========================
    /** Record real focus status */
    const focusRef = useRef<boolean>(false);

    const onContainerFocus: React.FocusEventHandler<HTMLElement> = (...args) => {
      setMockFocused(true);

      if (!disabled) {
        if (onFocus && !focusRef.current) {
          onFocus(...args);
        }

        // `showAction` should handle `focus` if set
        if (showAction.includes('focus')) {
          requestSetIsDropdownVisible(true);
        }
      }

      focusRef.current = true;
    };

    const onContainerBlur: React.FocusEventHandler<HTMLElement> = (...args) => {
      setMockFocused(false, () => {
        focusRef.current = false;
        requestSetIsDropdownVisible(false);
      });

      if (disabled) {
        return;
      }

      // If this selector uses search labels and the search textbox is out-of-sync with the
      // currently stashed option's search label and the `allowSearchLabelOnly` prop is true,
      // reselect the stashed option when the search textbox loses focus (or deselect the
      // search value that doesn't select an option)
      if (usesSearchLabels && !searchValueSelectsCurrentSelection && allowSearchLabelOnly) {
        if (hasStashedOption) {
          applyStashedOption();
        } else {
          requestSetSelectedOptions(undefined);
          requestSetSearchValue(undefined);
        }
      }

      if (searchValue) {
        // `tags` mode should move `searchValue` into values
        if (mode === 'tags') {
          triggerSearch('', false, false);
          triggerChange(Array.from(new Set([...rawValue, searchValue])));
        } else if (mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          requestSetSearchValue('');
        }
      }

      if (onBlur) {
        onBlur(...args);
      }
    };

    const activeTimeoutIds: number[] = [];
    useEffect(
      () => () => {
        activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      },
      [],
    );

    const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (event, ...restArgs) => {
      const { target } = event;
      const popupElement: HTMLDivElement =
        triggerRef.current && triggerRef.current.getPopupElement();

      // We should give focus back to selector if clicked item is not focusable
      if (popupElement && popupElement.contains(target as HTMLElement)) {
        const timeoutId = setTimeout(() => {
          const index = activeTimeoutIds.indexOf(timeoutId);
          if (index !== -1) {
            activeTimeoutIds.splice(index, 1);
          }

          cancelSetMockFocused();

          if (!popupElement.contains(document.activeElement)) {
            selectorRef.current.focus();
          }
        });

        activeTimeoutIds.push(timeoutId);
      }

      if (onMouseDown) {
        onMouseDown(event, ...restArgs);
      }
    };

    // ========================= Accessibility ==========================
    const [accessibilityIndex, setAccessibilityIndex] = useState<number>(0);
    const mergedDefaultActiveFirstOption =
      defaultActiveFirstOption !== undefined ? defaultActiveFirstOption : mode !== 'combobox';

    const onActiveValue: OnActiveValue = (active, index, { source = 'keyboard' } = {}) => {
      setAccessibilityIndex(index);

      if (backfill && mode === 'combobox' && active !== null && source === 'keyboard') {
        setActiveValue(String(active));
      }
    };

    // ============================= Popup ==============================
    const [containerWidth, setContainerWidth] = useState(null);

    const [, forceUpdate] = useState({});
    // We need force update here since popup dom is render async
    function onPopupMouseEnter() {
      forceUpdate({});
    }

    useLayoutEffect(() => {
      if (isDropdownVisible) {
        const newWidth = Math.ceil(containerRef.current.offsetWidth);
        if (containerWidth !== newWidth) {
          setContainerWidth(newWidth);
        }
      }
    }, [isDropdownVisible]);

    const popupNode = (
      <OptionList
        ref={listRef}
        prefixCls={prefixCls}
        id={mergedId}
        open={isDropdownVisible}
        childrenAsData={!props.options}
        options={displayOptions}
        flattenOptions={displayFlattenOptions}
        multiple={isMultiple}
        values={rawValues}
        height={listHeight}
        itemHeight={listItemHeight}
        onSelect={onInternalOptionSelect}
        requestSetIsDropdownVisible={requestSetIsDropdownVisible}
        onActiveValue={onActiveValue}
        defaultActiveFirstOption={mergedDefaultActiveFirstOption}
        notFoundContent={notFoundContent}
        onScroll={onPopupScroll}
        searchValue={searchValue}
        menuItemSelectedIcon={menuItemSelectedIcon}
        virtual={virtual !== false && dropdownMatchSelectWidth !== false}
        onMouseEnter={onPopupMouseEnter}
      />
    );

    // ============================= Clear ==============================
    let clearNode: React.ReactNode;
    const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
      // Trigger internal `onClear` event
      if (useInternalProps && internalProps.onClear) {
        internalProps.onClear();
      }

      if (onClear) {
        onClear();
      }

      triggerChange([]);
      triggerSearch('', false, false);
      if (mode === 'combobox') {
        requestSetSelectedOptions([convertToSelectedOption('')]);
      }
    };

    if (!disabled && allowClear && (rawValue.length || searchValue)) {
      clearNode = (
        <TransBtn
          className={`${prefixCls}-clear`}
          onMouseDown={onClearMouseDown}
          customizeIcon={clearIcon}
        >
          ×
        </TransBtn>
      );
    }

    // ============================= Arrow ==============================
    const showArrow =
      props.showArrow !== undefined
        ? props.showArrow
        : loading || (!isMultiple && mode !== 'combobox');
    let arrowNode: React.ReactNode;
    if (showArrow) {
      arrowNode = (
        <TransBtn
          className={classNames(`${prefixCls}-arrow`, {
            [`${prefixCls}-arrow-loading`]: loading,
          })}
          customizeIcon={inputIcon}
          customizeIconProps={{
            loading,
            searchValue,
            open: isDropdownVisible,
            focused: mockFocused,
            showSearch: mergedShowSearch,
          }}
        />
      );
    }

    // ============================ Warning =============================
    if (process.env.NODE_ENV !== 'production' && warningProps) {
      warningProps(props);
    }

    // ============================= Render =============================
    const className = classNames(prefixCls, props.className, {
      [`${prefixCls}-focused`]: mockFocused,
      [`${prefixCls}-multiple`]: isMultiple,
      [`${prefixCls}-single`]: !isMultiple,
      [`${prefixCls}-allow-clear`]: allowClear,
      [`${prefixCls}-show-arrow`]: showArrow,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-open`]: isDropdownVisible,
      [`${prefixCls}-customize-input`]: customizeInputElement,
      [`${prefixCls}-show-search`]: mergedShowSearch,
    });

    return (
      <div
        className={className}
        {...domProps}
        ref={containerRef}
        onMouseDown={onInternalMouseDown}
        onKeyDown={onInternalKeyDown}
        onKeyUp={onInternalKeyUp}
        onFocus={onContainerFocus}
        onBlur={onContainerBlur}
      >
        {mockFocused && !isDropdownVisible && (
          <span
            style={{
              width: 0,
              height: 0,
              display: 'flex',
              overflow: 'hidden',
              opacity: 0,
            }}
            aria-live="polite"
          >
            {/* Merge into one string to make screen reader work as expect */}
            {`${rawValue.join(', ')}`}
          </span>
        )}
        <SelectTrigger
          ref={triggerRef}
          disabled={disabled}
          prefixCls={prefixCls}
          visible={isDropdownVisible}
          popupElement={popupNode}
          containerWidth={containerWidth}
          animation={animation}
          transitionName={transitionName}
          dropdownStyle={dropdownStyle}
          dropdownClassName={dropdownClassName}
          direction={direction}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          dropdownRender={dropdownRender}
          dropdownAlign={dropdownAlign}
          getPopupContainer={getPopupContainer}
          empty={!options.length}
          getTriggerDOMNode={() => selectorDomRef.current}
        >
          <Selector
            {...props}
            domRef={selectorDomRef}
            prefixCls={prefixCls}
            inputElement={customizeInputElement}
            ref={selectorRef}
            id={mergedId}
            showSearch={mergedShowSearch}
            mode={mode}
            accessibilityIndex={accessibilityIndex}
            multiple={isMultiple}
            tagRender={tagRender}
            values={displayValues}
            open={isDropdownVisible}
            requestSetIsDropdownVisible={requestSetIsDropdownVisible}
            onFocus={onSelectorFocus}
            searchValue={searchValue}
            activeValue={activeValue}
            onSearch={triggerSearch}
            onSearchSubmit={onSearchSubmit}
            onSelect={onInternalSelectionSelect}
            tokenWithEnter={tokenWithEnter}
            searchValueSelectsCurrentSelection={searchValueSelectsCurrentSelection}
            onEscapeSearchInput={onEscapeSearchInput}
          />
        </SelectTrigger>

        {arrowNode}
        {clearNode}
      </div>
    );
  }

  // Ref of Select
  type RefSelectFuncType = typeof RefSelectFunc;
  const RefSelect = ((React.forwardRef as unknown) as RefSelectFuncType)(Select);

  return RefSelect;
}
