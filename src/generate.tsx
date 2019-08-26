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
import { RenderNode, Mode } from './interface';
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
} from './interface/generator';
import { OptionListProps, RefOptionListProps } from './OptionList';
import { toInnerValue, toOuterValues, removeLastEnabledValue } from './utils/commonUtil';
import TransBtn from './TransBtn';
import { useLock } from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import { usePropsWarning } from './hooks/usePropsWarning';
import { getSeparatedContent } from './utils/valueUtil';

export interface RefSelectProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectProps<OptionsType, ValueType> extends React.AriaAttributes {
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
  searchValue?: string;
  optionFilterProp?: string;
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc;
  showSearch?: boolean;
  autoClearSearchValue?: boolean;
  onSearch?: (value: string) => void;

  // Icons
  allowClear?: boolean;
  clearIcon?: React.ReactNode;
  showArrow?: boolean;
  inputIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;

  // Dropdown
  listHeight?: number;
  listItemHeight?: number;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  dropdownAlign?: any;
  animation?: string;
  transitionName?: string;

  // Others
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  placeholder?: React.ReactNode;
  backfill?: boolean;
  getInputElement?: () => JSX.Element;

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onDropdownVisibleChange?: (open: boolean) => void;
  onSelect?: (
    value: ValueType extends (infer SingleValueType)[] ? SingleValueType : ValueType,
    option: JSX.Element | JSX.Element[],
  ) => void;
  onDeselect?: (
    value: ValueType extends (infer SingleValueType)[] ? SingleValueType : ValueType,
    option: JSX.Element | JSX.Element[],
  ) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;

  // Motion
  choiceTransitionName?: string;

  // Legacy
  optionLabelProp?: string;
  open?: boolean;
  defaultOpen?: boolean;
  inputValue?: string;
  onClick?: React.MouseEventHandler;
  onChange?: (value: ValueType, option: JSX.Element | JSX.Element[]) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: (omittedValues: LabelValueType[]) => React.ReactNode;
  tokenSeparators?: string[];
  showAction?: string[];
  getPopupContainer?: RenderNode;
  tabIndex?: number;
}

export interface GenerateConfig<OptionsType, StaticProps> {
  components: {
    optionList: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<Omit<OptionListProps, 'options'> & { options: OptionsType }> &
        React.RefAttributes<RefOptionListProps>
    >;
  };
  staticProps?: StaticProps;
  /** Convert jsx tree into `OptionsType` */
  convertChildrenToData: (children: React.ReactNode) => OptionsType;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<OptionsType>;
  filterOptions: FilterOptions<OptionsType>;
  /** Check if a value is disabled */
  isValueDisabled: (value: RawValueType, options: OptionsType) => boolean;
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
  }[],
  StaticProps
>(config: GenerateConfig<OptionsType, StaticProps>) {
  /** Used for accessibility id generate */
  let uuid = 0;

  const {
    components: { optionList: OptionList },
    staticProps,
    convertChildrenToData,
    getLabeledValue,
    filterOptions,
    isValueDisabled,
  } = config;

  // Use raw define since `React.FC` not support generic
  function Select<ValueType extends DefaultValueType>(
    props: SelectProps<OptionsType, ValueType>,
    ref: React.Ref<RefSelectProps>,
  ): React.ReactElement {
    const {
      prefixCls = 'rc-select',
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
      removeIcon,
      menuItemSelectedIcon,

      // Others
      disabled,
      loading,
      defaultActiveFirstOption,
      notFoundContent = 'Not Found',
      optionLabelProp,
      placeholder,
      backfill,
      getInputElement,
      getPopupContainer,
      autoFocus,

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

      // Tags
      maxTagCount,
      maxTagTextLength,
      maxTagPlaceholder,
      tokenSeparators,

      // Motion
      choiceTransitionName,

      // Events
      onPopupScroll,
      onDropdownVisibleChange,
      onInputKeyDown,
      onClick,
      onFocus,
      onBlur,
      onKeyUp,
      onKeyDown,
      onMouseDown,

      onChange,
      onSelect,
      onDeselect,

      ...domProps
    } = props;

    const selectorRef = React.useRef<RefSelectorProps>(null);
    const listRef = React.useRef<RefOptionListProps>(null);

    // Inner id for accessibility usage. Only work in client side
    const [innerId, setInnerId] = React.useState<string>();
    React.useEffect(() => {
      setInnerId(`rc_select_${uuid}`);
      uuid += 1;
    }, []);
    const mergedId = id || innerId;

    // optionLabelProp
    let mergedOptionLabelProp = optionLabelProp;
    if (mergedOptionLabelProp === undefined) {
      mergedOptionLabelProp = options ? 'label' : 'children';
    }

    // labelInValue
    const mergedLabelInValue = mode === 'combobox' ? false : labelInValue;

    const mergedShowSearch =
      showSearch !== undefined ? showSearch : mode === 'tags' || mode === 'combobox';

    // ============================== Ref ===============================
    React.useImperativeHandle(ref, () => ({
      focus: selectorRef.current.focus,
      blur: selectorRef.current.blur,
    }));

    // ============================= Option =============================
    // Set by option list active, it will merge into search input when mode is `combobox`
    const [activeValue, setActiveValue] = React.useState<string>(null);
    const [innerSearchValue, setInnerSearchValue] = React.useState('');
    const mergedSearchValue = searchValue !== undefined ? searchValue : innerSearchValue;

    const mergedOptions = React.useMemo<OptionsType>((): OptionsType => {
      if (options !== undefined) {
        return options;
      }

      return convertChildrenToData(children);
    }, [options, children]);

    const displayOptions = React.useMemo<OptionsType>(() => {
      if (!mergedSearchValue) {
        return mergedOptions;
      }
      const filteredOptions: OptionsType = filterOptions(mergedSearchValue, mergedOptions, {
        optionFilterProp,
        filterOption: mode === 'combobox' && filterOption === undefined ? () => true : filterOption,
      });
      if (mode === 'tags' && filteredOptions.every(opt => opt.value !== mergedSearchValue)) {
        filteredOptions.unshift({
          value: mergedSearchValue,
          label: mergedSearchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }

      return filteredOptions;
    }, [mergedOptions, mergedSearchValue, mode]);

    // ============================= Value ==============================
    const [innerValue, setInnerValue] = React.useState<ValueType>(value || defaultValue);
    const baseValue = value !== undefined && value !== null ? value : innerValue;

    /** Unique raw values */
    const mergedRawValue = React.useMemo<RawValueType[]>(
      () => toInnerValue(baseValue, { labelInValue: mergedLabelInValue }),
      [baseValue, mergedLabelInValue],
    );
    /** We cache a set of raw values to speed up check */
    const rawValues = React.useMemo<Set<RawValueType>>(() => new Set(mergedRawValue), [
      mergedRawValue,
    ]);

    const displayValues = React.useMemo<DisplayLabelValueType[]>(
      () =>
        mergedRawValue.map((val: RawValueType) => {
          const displayValue = getLabeledValue(val, {
            options: mergedOptions,
            prevValue: baseValue,
            labelInValue: mergedLabelInValue,
            optionLabelProp: mergedOptionLabelProp,
          });

          return {
            ...displayValue,
            disabled: isValueDisabled(val, mergedOptions),
          };
        }),
      [baseValue, mergedOptions],
    );

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const triggerChange = (values: RawValueType[] | LabelValueType[]) => {
      const outValue: ValueType = (isMultiple ? values : values[0]) as ValueType;
      // Skip trigger if prev & current value is both empty
      if (onChange && (mergedRawValue.length !== 0 || values.length !== 0)) {
        // TODO: handle this
        onChange(outValue, null);
      }

      setInnerValue(outValue);
    };

    const onInternalSelect = (newValue: RawValueType, { selected }: { selected: boolean }) => {
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
        const outValue = toOuterValues<OptionsType>(Array.from(newRawValue), {
          labelInValue: mergedLabelInValue,
          options: mergedOptions,
          getLabeledValue,
          prevValue: baseValue,
          optionLabelProp: mergedOptionLabelProp,
        });

        triggerChange(outValue);
      }

      // Trigger `onSelect`
      const selectValue: any = mergedLabelInValue
        ? getLabeledValue(newValue, {
            options: mergedOptions,
            prevValue: baseValue,
            labelInValue: mergedLabelInValue,
            optionLabelProp: mergedOptionLabelProp,
          })
        : newValue;

      // TODO: second param
      // Single mode always trigger `onSelect`
      if ((!isMultiple || selected) && onSelect) {
        onSelect(selectValue, null);
      } else if (!selected && onDeselect) {
        onDeselect(selectValue, null);
      }

      // Clean search value if single or configured
      if (mode === 'combobox') {
        setInnerSearchValue(String(newValue));
        setActiveValue('');
      } else if (!isMultiple || autoClearSearchValue) {
        setInnerSearchValue('');
        setActiveValue('');
      }
    };

    // ============================= Input ==============================
    // Only works in `combobox`
    const customizeInputElement: React.ReactElement =
      (mode === 'combobox' && getInputElement && getInputElement()) || null;

    // ============================= Search =============================
    const triggerSearch = (searchText: string, fromTyping: boolean = true) => {
      let newSearchText = searchText;
      setActiveValue(null);

      // Check if match the `tokenSeparators`
      let patchRawValues: RawValueType[] = getSeparatedContent(searchText, tokenSeparators);

      if (mode === 'combobox') {
        // Only typing will trigger onChange
        if (fromTyping) {
          triggerChange([newSearchText]);
        }
      } else if (patchRawValues) {
        newSearchText = '';

        if (mode !== 'tags') {
          patchRawValues = patchRawValues.filter(rawValue =>
            mergedOptions.some(opt => opt.value === rawValue),
          );
        }

        const newRawValues = Array.from(
          new Set<RawValueType>([...mergedRawValue, ...patchRawValues]),
        );
        triggerChange(
          toOuterValues<OptionsType>(newRawValues, {
            labelInValue: mergedLabelInValue,
            getLabeledValue,
            options: mergedOptions,
            prevValue: baseValue,
            optionLabelProp: mergedOptionLabelProp,
          }),
        );
      }

      setInnerSearchValue(newSearchText);

      if (onSearch && mergedSearchValue !== newSearchText) {
        onSearch(newSearchText);
      }
    };

    // ============================== Open ==============================
    const [innerOpen, setInnerOpen] = React.useState<boolean>(defaultOpen);
    const mergedOpen: boolean = open !== undefined ? open : innerOpen;

    const onToggleOpen = (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;
      if (mergedOpen !== nextOpen && !disabled) {
        setInnerOpen(nextOpen);

        if (onDropdownVisibleChange) {
          onDropdownVisibleChange(nextOpen);
        }
      }
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
    const [clearLock, setClearLock] = useLock();

    // KeyDown
    const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
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
        triggerChange(removeLastEnabledValue(displayValues, baseValue as LabelValueType[]));
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
    const triggerRef = React.useRef<RefTriggerProps>(null);
    /** Used for component focused management */
    const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();
    /** Record real focus status */
    const focusRef = React.useRef<boolean>(false);

    const onContainerFocus: React.FocusEventHandler<HTMLElement> = (...args) => {
      setMockFocused(true);

      if (onFocus && !focusRef.current) {
        onFocus(...args);
      }
      focusRef.current = true;
    };

    const onContainerBlur: React.FocusEventHandler<HTMLElement> = (...args) => {
      setMockFocused(false, () => {
        focusRef.current = false;
        onToggleOpen(false);
      });
      if (onBlur) {
        onBlur(...args);
      }
    };

    const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (event, ...restArgs) => {
      const { target } = event;
      const popupElement: HTMLDivElement =
        triggerRef.current && triggerRef.current.getPopupElement();

      // We should give focus back to selector if clicked item is not focusable
      if (popupElement && popupElement.contains(target as any)) {
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
    const [accessibilityIndex, setAccessibilityIndex] = React.useState<number>(0);
    const mergedDefaultActiveFirstOption =
      defaultActiveFirstOption !== undefined ? defaultActiveFirstOption : mode !== 'combobox';

    const onActiveValue = (active: RawValueType, index: number) => {
      setAccessibilityIndex(index);

      if (backfill && mode === 'combobox' && active !== null) {
        setActiveValue(String(active));
      }
    };

    // ============================= Popup ==============================
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState(null);

    React.useLayoutEffect(() => {
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
        multiple={isMultiple}
        values={rawValues}
        height={listHeight}
        itemHeight={listItemHeight}
        onSelect={onInternalSelect}
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
      triggerChange([]);
      triggerSearch('', false);
    };

    if (allowClear && (mergedRawValue.length || mergedSearchValue)) {
      clearNode = (
        <TransBtn
          className={`${prefixCls}-selection-clear-icon`}
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
        <TransBtn className={`${prefixCls}-selection-arrow-icon`} customizeIcon={inputIcon} />
      );
    }

    // ============================ Warning =============================
    usePropsWarning({
      mode,
      options: mergedOptions,
      backfill,
      allowClear,
      placeholder,
      getInputElement,
      showSearch: mergedShowSearch,
      onSearch,
      autoFocus,
      defaultOpen,
    });

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
            style={{ width: 0, height: 0, display: 'flex', overflow: 'hidden', opacity: 0 }}
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
          visible={mergedOpen}
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
        >
          <Selector
            {...props}
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
            onSelect={onInternalSelect}
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

  // Inject static props
  if (staticProps) {
    Object.keys(staticProps).forEach(prop => {
      RefSelect[prop] = staticProps[prop];
    });
  }

  return RefSelect;
}
