/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import isMobile from 'rc-util/lib/isMobile';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ScrollTo } from 'rc-virtual-list/lib/List';
import type { RefSelectorProps } from './Selector';
import Selector from './Selector';
import type { RefTriggerProps } from './SelectTrigger';
import SelectTrigger from './SelectTrigger';
import type { RenderNode, Mode, RenderDOMFunc, OnActiveValue } from './interface';
import type {
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
  SelectSource,
  CustomTagProps,
} from './interface/generator';
import { INTERNAL_PROPS_MARK } from './interface/generator';
import type { OptionListProps, RefOptionListProps } from './OptionList';
import { toInnerValue, toOuterValues, removeLastEnabledValue, getUUID } from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import useLayoutEffect from './hooks/useLayoutEffect';
import { getSeparatedContent } from './utils/valueUtil';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useCacheDisplayValue from './hooks/useCacheDisplayValue';
import useCacheOptions from './hooks/useCacheOptions';

const DEFAULT_OMIT_PROPS = [
  'removeIcon',
  'placeholder',
  'autoFocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'tabIndex',
];

export interface RefSelectProps {
  focus: () => void;
  blur: () => void;
  scrollTo?: ScrollTo;
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
  /** Config max length of input. This is only work when `mode` is `combobox` */
  maxLength?: number;

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
  optionLabelProp?: string;
  maxTagTextLength?: number;
  maxTagCount?: number | 'responsive';
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
  flattenOptions: (options: OptionsType, props: any) => FlattenOptionsType<OptionsType>;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<FlattenOptionsType<OptionsType>>;
  filterOptions: FilterOptions<OptionsType>;
  findValueOption: // Need still support legacy ts api
  | ((values: RawValueType[], options: FlattenOptionsType<OptionsType>) => OptionsType)
    // New API add prevValueOptions support
    | ((
        values: RawValueType[],
        options: FlattenOptionsType<OptionsType>,
        info?: { prevValueOptions?: OptionsType[] },
      ) => OptionsType);
  /** Check if a value is disabled */
  isValueDisabled: (value: RawValueType, options: FlattenOptionsType<OptionsType>) => boolean;
  warningProps?: (props: any) => void;
  fillOptionsWithMissingValue?: (
    options: OptionsType,
    value: DefaultValueType,
    optionLabelProp: string,
    labelInValue: boolean,
  ) => OptionsType;
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
    fillOptionsWithMissingValue,
    omitDOMProps,
  } = config;

  // Use raw define since `React.FC` not support generic
  function Select<ValueType extends DefaultValueType>(
    props: SelectProps<OptionsType, ValueType>,
    ref: React.Ref<RefSelectProps>,
  ): React.ReactElement {
    const {
      prefixCls = defaultPrefixCls,
      className,
      id,

      open,
      defaultOpen,
      options,
      children,

      mode,
      value,
      defaultValue,
      labelInValue,

      // Search related
      showSearch,
      inputValue,
      searchValue,
      filterOption,
      filterSort,
      optionFilterProp = 'value',
      autoClearSearchValue = true,
      onSearch,

      // Icons
      allowClear,
      clearIcon,
      showArrow,
      inputIcon,
      menuItemSelectedIcon,

      // Others
      disabled,
      loading,
      defaultActiveFirstOption,
      notFoundContent = 'Not Found',
      optionLabelProp,
      backfill,
      tabIndex,
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
    DEFAULT_OMIT_PROPS.forEach((prop) => {
      delete domProps[prop];
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<RefTriggerProps>(null);
    const selectorRef = useRef<RefSelectorProps>(null);
    const listRef = useRef<RefOptionListProps>(null);

    const tokenWithEnter = useMemo(
      () =>
        (tokenSeparators || []).some((tokenSeparator) => ['\n', '\r\n'].includes(tokenSeparator)),
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
    let mergedOptionLabelProp = optionLabelProp;
    if (mergedOptionLabelProp === undefined) {
      mergedOptionLabelProp = options ? 'label' : 'children';
    }

    // labelInValue
    const mergedLabelInValue = mode === 'combobox' ? false : labelInValue;

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const mergedShowSearch =
      showSearch !== undefined ? showSearch : isMultiple || mode === 'combobox';

    // ======================== Mobile ========================
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
      // Only update on the client side
      setMobile(isMobile());
    }, []);

    // ============================== Ref ===============================
    const selectorDomRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      focus: selectorRef.current?.focus,
      blur: selectorRef.current?.blur,
      scrollTo: listRef.current?.scrollTo as ScrollTo,
    }));

    // ============================= Value ==============================
    const [mergedValue, setMergedValue] = useMergedState(defaultValue, {
      value,
    });

    /** Unique raw values */
    const [mergedRawValue, mergedValueMap] = useMemo<
      [RawValueType[], Map<RawValueType, LabelValueType>]
    >(
      () =>
        toInnerValue(mergedValue, {
          labelInValue: mergedLabelInValue,
          combobox: mode === 'combobox',
        }),
      [mergedValue, mergedLabelInValue],
    );
    /** We cache a set of raw values to speed up check */
    const rawValues = useMemo<Set<RawValueType>>(() => new Set(mergedRawValue), [mergedRawValue]);

    // ============================= Option =============================
    // Set by option list active, it will merge into search input when mode is `combobox`
    const [activeValue, setActiveValue] = useState<string>(null);
    const [innerSearchValue, setInnerSearchValue] = useState('');
    let mergedSearchValue = innerSearchValue;
    if (mode === 'combobox' && mergedValue !== undefined) {
      mergedSearchValue = mergedValue as string;
    } else if (searchValue !== undefined) {
      mergedSearchValue = searchValue;
    } else if (inputValue) {
      mergedSearchValue = inputValue;
    }

    const mergedOptions = useMemo<OptionsType>((): OptionsType => {
      let newOptions = options;
      if (newOptions === undefined) {
        newOptions = convertChildrenToData(children);
      }

      /**
       * `tags` should fill un-list item.
       * This is not cool here since TreeSelect do not need this
       */
      if (mode === 'tags' && fillOptionsWithMissingValue) {
        newOptions = fillOptionsWithMissingValue(
          newOptions,
          mergedValue,
          mergedOptionLabelProp,
          labelInValue,
        );
      }

      return newOptions || ([] as OptionsType);
    }, [options, children, mode, mergedValue]);

    const mergedFlattenOptions: FlattenOptionsType<OptionsType> = useMemo(
      () => flattenOptions(mergedOptions, props),
      [mergedOptions],
    );

    const getValueOption = useCacheOptions(mergedFlattenOptions);

    // Display options for OptionList
    const displayOptions = useMemo<OptionsType>(() => {
      if (!mergedSearchValue || !mergedShowSearch) {
        return [...mergedOptions] as OptionsType;
      }
      const filteredOptions: OptionsType = filterOptions(mergedSearchValue, mergedOptions, {
        optionFilterProp,
        filterOption: mode === 'combobox' && filterOption === undefined ? () => true : filterOption,
      });
      if (
        mode === 'tags' &&
        filteredOptions.every((opt) => opt[optionFilterProp] !== mergedSearchValue)
      ) {
        filteredOptions.unshift({
          value: mergedSearchValue,
          label: mergedSearchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }
      if (filterSort && Array.isArray(filteredOptions)) {
        return ([...filteredOptions] as OptionsType).sort(filterSort);
      }

      return filteredOptions;
    }, [mergedOptions, mergedSearchValue, mode, mergedShowSearch, filterSort]);

    const displayFlattenOptions: FlattenOptionsType<OptionsType> = useMemo(
      () => flattenOptions(displayOptions, props),
      [displayOptions],
    );

    useEffect(() => {
      if (listRef.current && listRef.current.scrollTo) {
        listRef.current.scrollTo(0);
      }
    }, [mergedSearchValue]);

    // ============================ Selector ============================
    let displayValues = useMemo<DisplayLabelValueType[]>(() => {
      const tmpValues = mergedRawValue.map((val: RawValueType) => {
        const valueOptions = getValueOption([val]);
        const displayValue = getLabeledValue(val, {
          options: valueOptions,
          prevValueMap: mergedValueMap,
          labelInValue: mergedLabelInValue,
          optionLabelProp: mergedOptionLabelProp,
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
    }, [mergedValue, mergedOptions, mode]);

    // Polyfill with cache label
    displayValues = useCacheDisplayValue(displayValues);

    const triggerSelect = (newValue: RawValueType, isSelect: boolean, source: SelectSource) => {
      const newValueOption = getValueOption([newValue]);
      const outOption = findValueOption([newValue], newValueOption)[0];

      if (!internalProps.skipTriggerSelect) {
        // Skip trigger `onSelect` or `onDeselect` if configured
        const selectValue = (mergedLabelInValue
          ? getLabeledValue(newValue, {
              options: newValueOption,
              prevValueMap: mergedValueMap,
              labelInValue: mergedLabelInValue,
              optionLabelProp: mergedOptionLabelProp,
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

    const triggerChange = (newRawValues: RawValueType[]) => {
      if (useInternalProps && internalProps.skipTriggerChange) {
        return;
      }
      const newRawValuesOptions = getValueOption(newRawValues);
      const outValues = toOuterValues<FlattenOptionsType<OptionsType>>(Array.from(newRawValues), {
        labelInValue: mergedLabelInValue,
        options: newRawValuesOptions,
        getLabeledValue,
        prevValueMap: mergedValueMap,
        optionLabelProp: mergedOptionLabelProp,
      });

      const outValue: ValueType = (isMultiple ? outValues : outValues[0]) as ValueType;
      // Skip trigger if prev & current value is both empty
      if (onChange && (mergedRawValue.length !== 0 || outValues.length !== 0)) {
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

      setMergedValue(outValue);
    };

    const onInternalSelect = (
      newValue: RawValueType,
      { selected, source }: { selected: boolean; source: 'option' | 'selection' },
    ) => {
      if (disabled) {
        return;
      }

      let newRawValue: Set<RawValueType>;

      if (isMultiple) {
        newRawValue = new Set(mergedRawValue);
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
      if (isMultiple || (!isMultiple && Array.from(mergedRawValue)[0] !== newValue)) {
        triggerChange(Array.from(newRawValue));
      }

      // Trigger `onSelect`. Single mode always trigger select
      triggerSelect(newValue, !isMultiple || selected, source);

      // Clean search value if single or configured
      if (mode === 'combobox') {
        setInnerSearchValue(String(newValue));
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        setInnerSearchValue('');
        setActiveValue('');
      }
    };

    const onInternalOptionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'option' });
    };

    const onInternalSelectionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'selection' });
    };

    // ============================= Input ==============================
    // Only works in `combobox`
    const customizeInputElement: React.ReactElement =
      (mode === 'combobox' && getInputElement && getInputElement()) || null;

    // ============================== Open ==============================
    const [innerOpen, setInnerOpen] = useMergedState<boolean>(undefined, {
      defaultValue: defaultOpen,
      value: open,
    });

    let mergedOpen = innerOpen;

    // Not trigger `open` in `combobox` when `notFoundContent` is empty
    const emptyListContent = !notFoundContent && !displayOptions.length;
    if (disabled || (emptyListContent && mergedOpen && mode === 'combobox')) {
      mergedOpen = false;
    }
    const triggerOpen = emptyListContent ? false : mergedOpen;

    const onToggleOpen = (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (innerOpen !== nextOpen && !disabled) {
        setInnerOpen(nextOpen);

        if (onDropdownVisibleChange) {
          onDropdownVisibleChange(nextOpen);
        }
      }
    };

    useSelectTriggerControl(
      [containerRef.current, triggerRef.current && triggerRef.current.getPopupElement()],
      triggerOpen,
      onToggleOpen,
    );

    // ============================= Search =============================
    const triggerSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
      let ret = true;
      let newSearchText = searchText;
      setActiveValue(null);

      // Check if match the `tokenSeparators`
      const patchLabels: string[] = isCompositing
        ? null
        : getSeparatedContent(searchText, tokenSeparators);
      let patchRawValues: RawValueType[] = patchLabels;

      if (mode === 'combobox') {
        // Only typing will trigger onChange
        if (fromTyping) {
          triggerChange([newSearchText]);
        }
      } else if (patchLabels) {
        newSearchText = '';

        if (mode !== 'tags') {
          patchRawValues = patchLabels
            .map((label) => {
              const item = mergedFlattenOptions.find(
                ({ data }) => data[mergedOptionLabelProp] === label,
              );
              return item ? item.data.value : null;
            })
            .filter((val: RawValueType) => val !== null);
        }

        const newRawValues = Array.from(
          new Set<RawValueType>([...mergedRawValue, ...patchRawValues]),
        );
        triggerChange(newRawValues);
        newRawValues.forEach((newRawValue) => {
          triggerSelect(newRawValue, true, 'input');
        });

        // Should close when paste finish
        onToggleOpen(false);

        // Tell Selector that break next actions
        ret = false;
      }

      setInnerSearchValue(newSearchText);

      if (onSearch && mergedSearchValue !== newSearchText) {
        onSearch(newSearchText);
      }

      return ret;
    };

    // Only triggered when menu is closed & mode is tags
    // If menu is open, OptionList will take charge
    // If mode isn't tags, press enter is not meaningful when you can't see any option
    const onSearchSubmit = (searchText: string) => {
      // prevent empty tags from appearing when you click the Enter button
      if (!searchText || !searchText.trim()) {
        return;
      }
      const newRawValues = Array.from(
        new Set<RawValueType>([...mergedRawValue, searchText]),
      );
      triggerChange(newRawValues);
      newRawValues.forEach((newRawValue) => {
        triggerSelect(newRawValue, true, 'input');
      });
      setInnerSearchValue('');
    };

    // Close dropdown when disabled change
    useEffect(() => {
      if (innerOpen && !!disabled) {
        setInnerOpen(false);
      }
    }, [disabled]);

    // Close will clean up single mode search text
    useEffect(() => {
      if (!mergedOpen && !isMultiple && mode !== 'combobox') {
        triggerSearch('', false, false);
      }
    }, [mergedOpen]);

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

      if (which === KeyCode.ENTER) {
        // Do not submit form when type in the input
        if (mode !== 'combobox') {
          event.preventDefault();
        }

        // We only manage open state here, close logic should handle by list component
        if (!mergedOpen) {
          onToggleOpen(true);
        }
      }

      setClearLock(!!mergedSearchValue);

      // Remove value by `backspace`
      if (
        which === KeyCode.BACKSPACE &&
        !clearLock &&
        isMultiple &&
        !mergedSearchValue &&
        mergedRawValue.length
      ) {
        const removeInfo = removeLastEnabledValue(displayValues, mergedRawValue);

        if (removeInfo.removedValue !== null) {
          triggerChange(removeInfo.values);
          triggerSelect(removeInfo.removedValue, false, 'input');
        }
      }

      if (mergedOpen && listRef.current) {
        listRef.current.onKeyDown(event, ...rest);
      }

      if (onKeyDown) {
        onKeyDown(event, ...rest);
      }
    };

    // KeyUp
    const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
      if (mergedOpen && listRef.current) {
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
          onToggleOpen(true);
        }
      }

      focusRef.current = true;
    };

    const onContainerBlur: React.FocusEventHandler<HTMLElement> = (...args) => {
      setMockFocused(false, () => {
        focusRef.current = false;
        onToggleOpen(false);
      });

      if (disabled) {
        return;
      }

      if (mergedSearchValue) {
        // `tags` mode should move `searchValue` into values
        if (mode === 'tags') {
          triggerSearch('', false, false);
          triggerChange(Array.from(new Set([...mergedRawValue, mergedSearchValue])));
        } else if (mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          setInnerSearchValue('');
        }
      }

      if (onBlur) {
        onBlur(...args);
      }
    };

    const activeTimeoutIds: any[] = [];
    useEffect(
      () => () => {
        activeTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
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

          if (!mobile && !popupElement.contains(document.activeElement)) {
            selectorRef.current?.focus();
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
      if (triggerOpen) {
        const newWidth = Math.ceil(containerRef.current.offsetWidth);
        if (containerWidth !== newWidth) {
          setContainerWidth(newWidth);
        }
      }
    }, [triggerOpen]);

    const popupNode = (
      <OptionList
        ref={listRef}
        prefixCls={prefixCls}
        id={mergedId}
        open={mergedOpen}
        childrenAsData={!options}
        options={displayOptions}
        flattenOptions={displayFlattenOptions}
        multiple={isMultiple}
        values={rawValues}
        height={listHeight}
        itemHeight={listItemHeight}
        onSelect={onInternalOptionSelect}
        onToggleOpen={onToggleOpen}
        onActiveValue={onActiveValue}
        defaultActiveFirstOption={mergedDefaultActiveFirstOption}
        notFoundContent={notFoundContent}
        onScroll={onPopupScroll}
        searchValue={mergedSearchValue}
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
    };

    if (!disabled && allowClear && (mergedRawValue.length || mergedSearchValue)) {
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
    const mergedShowArrow =
      showArrow !== undefined ? showArrow : loading || (!isMultiple && mode !== 'combobox');
    let arrowNode: React.ReactNode;

    if (mergedShowArrow) {
      arrowNode = (
        <TransBtn
          className={classNames(`${prefixCls}-arrow`, {
            [`${prefixCls}-arrow-loading`]: loading,
          })}
          customizeIcon={inputIcon}
          customizeIconProps={{
            loading,
            searchValue: mergedSearchValue,
            open: mergedOpen,
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
    const mergedClassName = classNames(prefixCls, className, {
      [`${prefixCls}-focused`]: mockFocused,
      [`${prefixCls}-multiple`]: isMultiple,
      [`${prefixCls}-single`]: !isMultiple,
      [`${prefixCls}-allow-clear`]: allowClear,
      [`${prefixCls}-show-arrow`]: mergedShowArrow,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-open`]: mergedOpen,
      [`${prefixCls}-customize-input`]: customizeInputElement,
      [`${prefixCls}-show-search`]: mergedShowSearch,
    });

    return (
      <div
        className={mergedClassName}
        {...domProps}
        ref={containerRef}
        onMouseDown={onInternalMouseDown}
        onKeyDown={onInternalKeyDown}
        onKeyUp={onInternalKeyUp}
        onFocus={onContainerFocus}
        onBlur={onContainerBlur}
      >
        {mockFocused && !mergedOpen && (
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
            {`${mergedRawValue.join(', ')}`}
          </span>
        )}
        <SelectTrigger
          ref={triggerRef}
          disabled={disabled}
          prefixCls={prefixCls}
          visible={triggerOpen}
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
          empty={!mergedOptions.length}
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
            open={mergedOpen}
            onToggleOpen={onToggleOpen}
            searchValue={mergedSearchValue}
            activeValue={activeValue}
            onSearch={triggerSearch}
            onSearchSubmit={onSearchSubmit}
            onSelect={onInternalSelectionSelect}
            tokenWithEnter={tokenWithEnter}
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
