/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import Selector, { RefSelectorProps } from './Selector';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import { RenderNode, Mode, RenderDOMFunc } from './interface';
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
} from './interface/generator';
import { OptionListProps, RefOptionListProps } from './OptionList';
import {
  toInnerValue,
  toOuterValues,
  removeLastEnabledValue,
  getUUID,
} from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import useLayoutEffect from './hooks/useLayoutEffect';
import { getSeparatedContent } from './utils/valueUtil';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';

const DEFAULT_OMIT_PROPS = [
  'removeIcon',
  'placeholder',
  'autoFocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
];

export interface RefSelectProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectProps<OptionsType extends object[], ValueType>
  extends React.AriaAttributes {
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
  showSearch?: boolean;
  autoClearSearchValue?: boolean;
  onSearch?: (value: string) => void;

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
  dropdownMatchSelectWidth?: true | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  dropdownAlign?: any;
  animation?: string;
  transitionName?: string;
  getPopupContainer?: RenderDOMFunc;

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
  maxTagCount?: number;
  maxTagPlaceholder?:
    | React.ReactNode
    | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  showAction?: ('focus' | 'click')[];
  tabIndex?: number;

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onDropdownVisibleChange?: (open: boolean) => void;
  onSelect?: (
    value: SingleType<ValueType>,
    option: OptionsType[number],
  ) => void;
  onDeselect?: (
    value: SingleType<ValueType>,
    option: OptionsType[number],
  ) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler;
  onChange?: (
    value: ValueType,
    option: OptionsType[number] | OptionsType,
  ) => void;
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
    onRawSelect?: (
      value: RawValueType,
      option: OptionsType[number],
      source: SelectSource,
    ) => void;
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
  flattenOptions: (
    options: OptionsType,
    props: any,
  ) => FlattenOptionsType<OptionsType>;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<FlattenOptionsType<OptionsType>>;
  filterOptions: FilterOptions<OptionsType>;
  findValueOption: (
    values: RawValueType[],
    options: FlattenOptionsType<OptionsType>,
  ) => OptionsType;
  /** Check if a value is disabled */
  isValueDisabled: (
    value: RawValueType,
    options: FlattenOptionsType<OptionsType>,
  ) => boolean;
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
      getInputElement,
      getPopupContainer,

      // Dropdown
      listHeight = 200,
      listItemHeight = 20,
      animation,
      transitionName,
      dropdownStyle,
      dropdownClassName,
      dropdownMatchSelectWidth,
      dropdownRender,
      dropdownAlign,
      showAction = [],

      // Tags
      tokenSeparators,

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

      internalProps = {},

      ...restProps
    } = props;

    const useInternalProps = internalProps.mark === INTERNAL_PROPS_MARK;

    const domProps = omitDOMProps ? omitDOMProps(restProps) : restProps;
    DEFAULT_OMIT_PROPS.forEach(prop => {
      delete domProps[prop];
    });

    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<RefTriggerProps>(null);
    const selectorRef = React.useRef<RefSelectorProps>(null);
    const listRef = React.useRef<RefOptionListProps>(null);

    /** Used for component focused management */
    const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

    // Inner id for accessibility usage. Only work in client side
    const [innerId, setInnerId] = React.useState<string>();
    React.useEffect(() => {
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

    // ============================== Ref ===============================
    const selectorDomRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      focus: selectorRef.current.focus,
      blur: selectorRef.current.blur,
    }));

    // ============================= Value ==============================
    const [innerValue, setInnerValue] = React.useState<ValueType>(
      value || defaultValue,
    );
    const baseValue =
      value !== undefined && value !== null ? value : innerValue;

    /** Unique raw values */
    const mergedRawValue = React.useMemo<RawValueType[]>(
      () =>
        toInnerValue(baseValue, {
          labelInValue: mergedLabelInValue,
          combobox: mode === 'combobox',
        }),
      [baseValue, mergedLabelInValue],
    );
    /** We cache a set of raw values to speed up check */
    const rawValues = React.useMemo<Set<RawValueType>>(
      () => new Set(mergedRawValue),
      [mergedRawValue],
    );

    // ============================= Option =============================
    // Set by option list active, it will merge into search input when mode is `combobox`
    const [activeValue, setActiveValue] = React.useState<string>(null);
    const [innerSearchValue, setInnerSearchValue] = React.useState('');
    let mergedSearchValue = innerSearchValue;
    if (searchValue !== undefined) {
      mergedSearchValue = searchValue;
    } else if (inputValue) {
      mergedSearchValue = inputValue;
    }

    const mergedOptions = React.useMemo<OptionsType>((): OptionsType => {
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
          baseValue,
          mergedOptionLabelProp,
          labelInValue,
        );
      }

      return newOptions || ([] as OptionsType);
    }, [options, children, mode, baseValue]);

    const mergedFlattenOptions: FlattenOptionsType<OptionsType> = React.useMemo(
      () => flattenOptions(mergedOptions, props),
      [mergedOptions],
    );

    // Display options for OptionList
    const displayOptions = React.useMemo<OptionsType>(() => {
      if (!mergedSearchValue) {
        return [...mergedOptions] as OptionsType;
      }
      const filteredOptions: OptionsType = filterOptions(
        mergedSearchValue,
        mergedOptions,
        {
          optionFilterProp,
          filterOption:
            mode === 'combobox' && filterOption === undefined
              ? () => true
              : filterOption,
        },
      );
      if (
        mode === 'tags' &&
        filteredOptions.every(opt => opt.value !== mergedSearchValue)
      ) {
        filteredOptions.unshift({
          value: mergedSearchValue,
          label: mergedSearchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }

      return filteredOptions;
    }, [mergedOptions, mergedSearchValue, mode]);

    const displayFlattenOptions: FlattenOptionsType<
      OptionsType
    > = React.useMemo(() => flattenOptions(displayOptions, props), [
      displayOptions,
    ]);

    // ============================ Selector ============================
    const displayValues = React.useMemo<DisplayLabelValueType[]>(
      () =>
        mergedRawValue.map((val: RawValueType) => {
          const displayValue = getLabeledValue(val, {
            options: mergedFlattenOptions,
            prevValue: baseValue,
            labelInValue: mergedLabelInValue,
            optionLabelProp: mergedOptionLabelProp,
          });

          return {
            ...displayValue,
            disabled: isValueDisabled(val, mergedFlattenOptions),
          };
        }),
      [baseValue, mergedOptions],
    );

    const triggerSelect = (
      newValue: RawValueType,
      isSelect: boolean,
      source: SelectSource,
    ) => {
      const outOption = findValueOption([newValue], mergedFlattenOptions)[0];

      if (!internalProps.skipTriggerSelect) {
        // Skip trigger `onSelect` or `onDeselect` if configured
        const selectValue = (mergedLabelInValue
          ? getLabeledValue(newValue, {
              options: mergedFlattenOptions,
              prevValue: baseValue,
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

    const triggerChange = (newRawValues: RawValueType[]) => {
      if (useInternalProps && internalProps.skipTriggerChange) {
        return;
      }

      const outValues = toOuterValues<FlattenOptionsType<OptionsType>>(
        Array.from(newRawValues),
        {
          labelInValue: mergedLabelInValue,
          options: mergedFlattenOptions,
          getLabeledValue,
          prevValue: baseValue,
          optionLabelProp: mergedOptionLabelProp,
        },
      );

      const outValue: ValueType = (isMultiple
        ? outValues
        : outValues[0]) as ValueType;
      // Skip trigger if prev & current value is both empty
      if (onChange && (mergedRawValue.length !== 0 || outValues.length !== 0)) {
        const outOptions = findValueOption(newRawValues, mergedFlattenOptions);

        onChange(outValue, isMultiple ? outOptions : outOptions[0]);
      }

      setInnerValue(outValue);
    };

    const onInternalSelect = (
      newValue: RawValueType,
      {
        selected,
        source,
      }: { selected: boolean; source: 'option' | 'selection' },
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
      if (
        isMultiple ||
        (!isMultiple && Array.from(mergedRawValue)[0] !== newValue)
      ) {
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

    const onInternalOptionSelect = (
      newValue: RawValueType,
      info: { selected: boolean },
    ) => {
      onInternalSelect(newValue, { ...info, source: 'option' });
    };

    const onInternalSelectionSelect = (
      newValue: RawValueType,
      info: { selected: boolean },
    ) => {
      onInternalSelect(newValue, { ...info, source: 'selection' });
    };

    // ============================= Input ==============================
    // Only works in `combobox`
    const customizeInputElement: React.ReactElement =
      (mode === 'combobox' && getInputElement && getInputElement()) || null;

    // ============================== Open ==============================
    const [innerOpen, setInnerOpen] = React.useState<boolean>(defaultOpen);
    let mergedOpen: boolean = open !== undefined ? open : innerOpen;

    // Not trigger `open` in `combobox` when `notFoundContent` is empty
    const emptyListContent = !notFoundContent && !displayOptions.length;
    if (emptyListContent && mergedOpen && mode === 'combobox') {
      mergedOpen = false;
    }
    const triggerOpen = emptyListContent ? false : mergedOpen;

    const onToggleOpen = (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (mergedOpen !== nextOpen && !disabled) {
        setInnerOpen(nextOpen);

        if (onDropdownVisibleChange) {
          onDropdownVisibleChange(nextOpen);
        }
      }
    };

    useSelectTriggerControl(
      [
        containerRef.current,
        triggerRef.current && triggerRef.current.getPopupElement(),
      ],
      triggerOpen,
      onToggleOpen,
    );

    // ============================= Search =============================
    const triggerSearch = (searchText: string, fromTyping: boolean = true) => {
      let ret = true;
      let newSearchText = searchText;
      setActiveValue(null);

      // Check if match the `tokenSeparators`
      const patchLabels: string[] = getSeparatedContent(
        searchText,
        tokenSeparators,
      );
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
            .map(label => {
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
        newRawValues.forEach(newRawValue => {
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

    // Close will clean up single mode search text
    React.useEffect(() => {
      if (!mergedOpen && !isMultiple && mode !== 'combobox') {
        triggerSearch('', false);
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
    const clearLock = getClearLock();

    // KeyDown
    const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
      event,
      ...rest
    ) => {
      const { which } = event;

      // We only manage open state here, close logic should handle by list component
      if (!mergedOpen && which === KeyCode.ENTER) {
        onToggleOpen(true);
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
        const removeInfo = removeLastEnabledValue(
          displayValues,
          mergedRawValue,
        );

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
    const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (
      event,
      ...rest
    ) => {
      if (mergedOpen && listRef.current) {
        listRef.current.onKeyUp(event, ...rest);
      }

      if (onKeyUp) {
        onKeyUp(event, ...rest);
      }
    };

    // ========================== Focus / Blur ==========================
    /** Record real focus status */
    const focusRef = React.useRef<boolean>(false);

    const onContainerFocus: React.FocusEventHandler<HTMLElement> = (
      ...args
    ) => {
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
          triggerSearch('', false);
          triggerChange(
            Array.from(new Set([...mergedRawValue, mergedSearchValue])),
          );
        } else if (mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          setInnerSearchValue('');
        }
      }

      if (onBlur) {
        onBlur(...args);
      }
    };

    const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (
      event,
      ...restArgs
    ) => {
      const { target } = event;
      const popupElement: HTMLDivElement =
        triggerRef.current && triggerRef.current.getPopupElement();

      // We should give focus back to selector if clicked item is not focusable
      if (popupElement && popupElement.contains(target as HTMLElement)) {
        setTimeout(() => {
          cancelSetMockFocused();
          if (!popupElement.contains(document.activeElement)) {
            selectorRef.current.focus();
          }
        });
      }

      if (onMouseDown) {
        onMouseDown(event, ...restArgs);
      }
    };

    // ========================= Accessibility ==========================
    const [accessibilityIndex, setAccessibilityIndex] = React.useState<number>(
      0,
    );
    const mergedDefaultActiveFirstOption =
      defaultActiveFirstOption !== undefined
        ? defaultActiveFirstOption
        : mode !== 'combobox';

    const onActiveValue = (active: RawValueType, index: number) => {
      setAccessibilityIndex(index);

      if (backfill && mode === 'combobox' && active !== null) {
        setActiveValue(String(active));
      }
    };

    // ============================= Popup ==============================
    const [containerWidth, setContainerWidth] = React.useState(null);

    useLayoutEffect(() => {
      const newWidth = Math.ceil(containerRef.current.offsetWidth);
      if (containerWidth !== newWidth) {
        setContainerWidth(newWidth);
      }
    });

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
      />
    );

    // ============================= Clear ==============================
    let clearNode: React.ReactNode;
    const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
      // Trigger internal `onClear` event
      if (useInternalProps && internalProps.onClear) {
        internalProps.onClear();
      }

      triggerChange([]);
      triggerSearch('', false);
    };

    if (
      !disabled &&
      allowClear &&
      (mergedRawValue.length || mergedSearchValue)
    ) {
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
      showArrow !== undefined
        ? showArrow
        : loading || (!isMultiple && mode !== 'combobox');
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
            values={displayValues}
            open={mergedOpen}
            onToggleOpen={onToggleOpen}
            searchValue={mergedSearchValue}
            activeValue={activeValue}
            onSearch={triggerSearch}
            onSelect={onInternalSelectionSelect}
          />
        </SelectTrigger>

        {arrowNode}
        {clearNode}
      </div>
    );
  }

  // Ref of Select
  type RefSelectFuncType = typeof RefSelectFunc;
  const RefSelect = ((React.forwardRef as unknown) as RefSelectFuncType)(
    Select,
  );

  return RefSelect;
}
