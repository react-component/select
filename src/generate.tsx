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
import useOptions from './hooks/useOptions';
import useWarnings from './hooks/useWarnings';
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
  FilterOptions,
  FilterFunc,
  DefaultValueType,
  RawValueType,
  LabelValueType,
  Key,
  RefSelectFunc,
  SingleType,
  OnClear,
  INTERNAL_PROPS_MARK,
  SelectSource,
  CustomTagProps,
} from './interface/generator';
import { OptionListProps, RefOptionListProps } from './OptionList';
import { removeLastEnabledValue, getUUID } from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import useLayoutEffect from './hooks/useLayoutEffect';
import {
  toOptionData,
  getSeparatedContent,
} from './utils/valueUtil';

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
  'optionSelectedLabelProp',
  'optionSelectableLabelProp',
  'persistSelectedLabelsOnly',
  'showSearch',
  'values',
  'disabled',
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
  optionSelectedLabelProp?: string;
  optionSelectableLabelProp?: string;
  persistSelectedLabelsOnly?: boolean;
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
  onChange?: (value: ValueType, option: Partial<OptionData> | Partial<OptionData>[]) => void;
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
      React.PropsWithoutRef<OptionListProps> & React.RefAttributes<RefOptionListProps>
    >;
  };
  /** Convert jsx tree into `OptionsType` */
  convertChildrenToData: (children: React.ReactNode) => OptionsType;
  /** Flatten nest options into raw option list */
  flattenOptions: (options: OptionsType) => FlattenOptionData[];
  filterOptions: FilterOptions<OptionsType>;
  /** Check if a value is disabled */
  isValueDisabled?: (value: RawValueType, options: FlattenOptionData[]) => boolean;
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
    filterOptions,
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

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const showSearch = props.showSearch !== undefined
      ? props.showSearch
      : ['tags', 'multiple', 'combobox'].includes(props.mode);

    // Whether selected option's labels are being kept within the search value (only combobox mode)
    const usesSearchLabels = mode === 'combobox';

    const persistSelectedLabelsOnly =
      props.persistSelectedLabelsOnly !== undefined ? props.persistSelectedLabelsOnly : false;

    const optionLabelProp = [props.optionLabelProp, props.options ? 'label' : 'children'].find(
      x => x !== undefined,
    );

    const optionSelectableLabelProp = [
      props.optionSelectableLabelProp,
      optionLabelProp,
    ].find(x => x !== undefined);

    const optionSelectedLabelProp = [
      props.optionSelectedLabelProp,
      mode === 'combobox' && showSearch
        ? 'value'
        : optionLabelProp,
    ].find(x => x !== undefined);

    // Whether the exposed event handlers (onChange, onSelect, etc.) provide the selected option's
    // data as RawValueType instead of OptionData
    const receiveRawValue = !labelInValue;

    // ========================= Search Value ===========================
    const [requestedSearchValue, requestSetSearchValue] = useState(undefined);
    const searchValue = (() => {
      if (mode === 'combobox' && props.value === null) return '';

      return [
        usesSearchLabels
          ? (toOptionData(props.value) || {})[optionSelectedLabelProp]
          : undefined,
        props.searchValue,
        props.inputValue,
        requestedSearchValue,
      ].find(x => x !== undefined);
    })();

    // ============================ Options =============================
    const {
      selectedOptions,
      rawValue,
      rawValues,
      options,
      flattenedOptions,
      displayOptions,
      displayValues,
      toCollectedOptionData,
      toReceivableValue,
      toReceivableOption,
      stashedOption,
      requestSetSelectedOptions,
    } = useOptions({
      convertChildrenToData,
      searchValue,
      receiveRawValue,
      showSearch,
      filterSort,
      filterOption,
      filterOptions,
      flattenOptions,
      optionFilterProp,
      optionSelectedLabelProp,
      optionSelectableLabelProp,
      mode,
      propsOptions: props.options,
      propsChildren: props.children,
      propsValue: props.value,
      propsDefaultValue: props.defaultValue,
    });

    // ============================== Ref ===============================
    const selectorDomRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      focus: selectorRef.current.focus,
      blur: selectorRef.current.blur,
    }));

    // Set by option list active, it will merge into search input when mode is `combobox`
    const [activeValue, setActiveValue] = useState<string>(null);

    // ====================== Search Value (Effects) ====================
    useEffect(() => {
      if (listRef.current && listRef.current.scrollTo) {
        listRef.current.scrollTo(0);
      }
    }, [searchValue]);

    const selectedOptionSearchLabel: string | undefined = useMemo(() => {
      if (usesSearchLabels && selectedOptions.length) {
        return String(selectedOptions[0][optionSelectedLabelProp]);
      }
      return undefined;
    }, [usesSearchLabels, selectedOptions, optionSelectedLabelProp]);

    const [searchValueIsSelectedLabel, setSearchValueIsSelectedLabel] = useState<
      boolean
    >(false);

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
        setSearchValueIsSelectedLabel(true);
      }
    }, [searchValue, usesSearchLabels, selectedOptions, selectedOptionSearchLabel]);

    // Whenever the search value changes, determine whether this would deselect the currently
    // selected option
    useEffect(() => {
      if (usesSearchLabels && searchValue !== undefined) {
        // When there is a previously selected option stashed, don't manage the search value
        if (!stashedOption.isStashed) {
          if (searchValueIsSelectedLabel && searchValue !== selectedOptionSearchLabel) {
            // Store the previously selected option to return to it later upon hitting Escape within
            // the search textbox
            stashedOption.stash();

            setSearchValueIsSelectedLabel(false);
          }
        }
      }
    }, [
      usesSearchLabels,
      searchValue,
      stashedOption.isStashed,
      searchValueIsSelectedLabel,
      selectedOptionSearchLabel,
    ]);

    // Whenever the selected options change, attempt to update the search value with a search label
    // to indicate the newly selected option or an empty string if circumstances require it
    useEffect(() => {
      if (usesSearchLabels && searchValue !== undefined) {
        // When there is a previously selected option stashed, don't manage the search value
        if (!stashedOption.isStashed) {
          requestSetSearchValue(selectedOptionSearchLabel);
          setSearchValueIsSelectedLabel(true);
        }
      }
    }, [selectedOptions, stashedOption.isStashed, selectedOptionSearchLabel]);

    // ======================= onChange / onSelect ======================
    const triggerSelect = (newValue: RawValueType, isSelect: boolean, source: SelectSource) => {
      const selectValue = toReceivableValue(newValue);
      const outOption = toReceivableOption(newValue);

      if (!internalProps.skipTriggerSelect) {
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

    const triggerChange = (newRawValues: RawValueType[], fromSearching = false) => {
      if (useInternalProps && internalProps.skipTriggerChange) {
        return;
      }

      if (onChange) {
        const receivableValues = newRawValues.map(value => toReceivableValue(value));
        const receivableOptions = newRawValues.map(value => toReceivableOption(value));
        onChange(
          isMultiple ? receivableValues : receivableValues[0],
          isMultiple ? receivableOptions : receivableOptions[0],
        );
      }

      if (!fromSearching) {
        requestSetSelectedOptions(
          newRawValues.map(value => toCollectedOptionData(value)),
        );
      }
    };

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
        requestSetSearchValue(toCollectedOptionData(newValue)[optionSelectedLabelProp]);
        setSearchValueIsSelectedLabel(true);
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        requestSetSearchValue('');
        setActiveValue('');
      }

      // Forget about the stashed option (if there was one) after an option has been selected
      stashedOption.remove();
    };

    const onInternalOptionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'option' });
    };

    const onInternalSelectionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
      onInternalSelect(newValue, { ...info, source: 'selection' });
    };

    stashedOption.useIfReadyToApply(() => {
      onInternalSelect(stashedOption.data !== undefined && stashedOption.data.length
        ? stashedOption.data[0].value
        : undefined,
        {
          selected: true,
          source: 'stash',
        },
      );
    });

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

    // ============================ Selector ============================
    // Keep track of whether the selector has received focus yet so that the
    // `onSearch` doesn't get called before search is possible by the user
    const [selectorHasFocused, setSelectorHasFocused] = useState<boolean>(false);
    const onSelectorFocus = () => setSelectorHasFocused(true);

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
                const item = flattenedOptions.find(
                  ({ data }) => data[optionLabelProp] === label,
                );
                return item ? item.data.value : null;
              })
              .filter((val: RawValueType) => val !== null);
          }

          const newRawValues = Array.from(new Set<RawValueType>([...rawValue, ...patchRawValues]));
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
      if (usesSearchLabels && stashedOption.isStashed) {
        stashedOption.readyToApply();
      }
    }, [usesSearchLabels, stashedOption.isStashed, stashedOption.data]);

    // Close dropdown when disabled change
    useEffect(() => {
      if (props.disabled) {
        requestSetIsDropdownVisible(false);
      }
    }, [props.disabled]);

    // Close will clean up single mode search text
    useEffect(() => {
      if (!isDropdownVisible && !isMultiple && !usesSearchLabels) {
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

      if (!props.disabled) {
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

      if (props.disabled) {
        return;
      }

      // If this selector uses search labels and the search textbox is out-of-sync with the
      // currently stashed option's search label and the `persistSelectedLabelsOnly` prop is
      // true, reselect the stashed option when the search textbox loses focus (or deselect
      // the search value that doesn't select an option)
      if (usesSearchLabels && !searchValueIsSelectedLabel && persistSelectedLabelsOnly) {
        if (stashedOption.isStashed) {
          stashedOption.readyToApply();
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
        displayOptions={displayOptions}
        optionSelectableLabelProp={optionSelectableLabelProp}
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
        requestSetSelectedOptions([toOptionData('') as OptionData]);
      }
    };

    let clearNode: React.ReactNode;
    if (!props.disabled && allowClear && (rawValue.length || searchValue)) {
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
            showSearch,
          }}
        />
      );
    }

    // ============================ Warning =============================
    useWarnings({
      warningsEnabled: process.env.NODE_ENV !== 'production',
      evaluateProps: warningProps,
      toCollectedOptionData,
      labelInValue,
      optionSelectedLabelProp,
      optionSelectableLabelProp,
      props,
    });

    // ============================= Render =============================
    const className = classNames(prefixCls, props.className, {
      [`${prefixCls}-focused`]: mockFocused,
      [`${prefixCls}-multiple`]: isMultiple,
      [`${prefixCls}-single`]: !isMultiple,
      [`${prefixCls}-allow-clear`]: allowClear,
      [`${prefixCls}-show-arrow`]: showArrow,
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-open`]: isDropdownVisible,
      [`${prefixCls}-customize-input`]: customizeInputElement,
      [`${prefixCls}-show-search`]: showSearch,
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
          disabled={props.disabled}
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
            showSearch={showSearch}
            mode={mode}
            accessibilityIndex={accessibilityIndex}
            multiple={isMultiple}
            tagRender={tagRender}
            displayValues={displayValues}
            open={isDropdownVisible}
            requestSetIsDropdownVisible={requestSetIsDropdownVisible}
            onFocus={onSelectorFocus}
            searchValue={searchValue}
            activeValue={activeValue}
            onSearch={triggerSearch}
            onSearchSubmit={onSearchSubmit}
            onSelect={onInternalSelectionSelect}
            tokenWithEnter={tokenWithEnter}
            searchValueIsSelectedLabel={searchValueIsSelectedLabel}
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
