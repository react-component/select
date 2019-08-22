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
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 */

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import warning from 'rc-util/lib/warning';
import Selector, { RefSelectorProps } from './Selector';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import { SelectContext } from './Context';
import { RenderNode, OptionsType as SelectOptionsType, Mode } from './interface';
import {
  GetLabeledValue,
  FilterOptions,
  FilterFunc,
  DefaultValueType,
  RawValueType,
  LabelValueType,
  Key,
} from './interface/generator';
import SelectOptionList, { OptionListProps, RefProps } from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import { convertChildrenToData as convertSelectChildrenToData } from './utils/legacyUtil';
import {
  getLabeledValue as getSelectLabeledValue,
  filterOptions as selectDefaultFilterOptions,
  getSeparatedContent,
} from './utils/valueUtil';
import { toInnerValue, toOuterValues } from './utils/commonUtil';
import TransBtn from './TransBtn';
import { useLock } from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';

export interface SelectProps<OptionsType, ValueType> {
  prefixCls?: string;
  id?: string;
  className?: string;

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
  autoClearSearchValue?: boolean;
  onSearch?: (value: string) => void;

  // Icons
  allowClear?: boolean;
  clearIcon?: React.ReactNode;
  showArrow?: boolean;
  inputIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;

  // Trigger
  listHeight?: number;
  listItemHeight?: number;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;

  // Others
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  placeholder?: React.ReactNode;

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Legacy
  showSearch?: boolean;
  style?: React.CSSProperties;
  openClassName?: string;
  transitionName?: string;
  optionLabelProp?: string;
  animation?: string;
  choiceTransitionName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  inputValue?: string;
  onClick?: React.MouseEventHandler;
  onChange?: (value: ValueType, option: JSX.Element | JSX.Element[]) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onSelect?: (
    value: ValueType extends (infer SingleValueType)[] ? SingleValueType : ValueType,
    option: JSX.Element | JSX.Element[],
  ) => void;
  onDeselect?: (
    value: ValueType extends (infer SingleValueType)[] ? SingleValueType : ValueType,
    option: JSX.Element | JSX.Element[],
  ) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: RenderNode;
  tokenSeparators?: string[];
  getInputElement?: () => JSX.Element;
  showAction?: string[];
  getPopupContainer?: RenderNode;
  backfill?: boolean;
  dropdownAlign?: any;
  tabIndex?: number;
}

export interface GenerateConfig<OptionsType, StaticProps> {
  components: {
    optionList: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<Omit<OptionListProps, 'options'> & { options: OptionsType }> &
        React.RefAttributes<RefProps>
    >;
  };
  staticProps?: StaticProps;
  /** Convert jsx tree into `OptionsType` */
  convertChildrenToData: (children: React.ReactNode) => OptionsType;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<OptionsType>;
  filterOptions: FilterOptions<OptionsType>;
}

/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */
export function generateSelector<
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
  } = config;

  // Use raw define since `React.FC` not support generic
  function Select<ValueType extends DefaultValueType>(
    props: SelectProps<OptionsType, ValueType>,
  ): React.ReactElement {
    const {
      prefixCls = 'rc-select',

      id,
      mode,
      value,
      defaultValue,

      // Search related
      showSearch,
      searchValue,
      filterOption,
      optionFilterProp,
      autoClearSearchValue = true,
      onSearch,

      // Icons
      allowClear,
      clearIcon,
      showArrow,
      inputIcon,
      removeIcon,

      // Others
      disabled,
      loading,
      defaultActiveFirstOption,
      notFoundContent = 'Not Found',
      optionLabelProp,
      placeholder,

      // Dropdown
      listHeight = 200,
      listItemHeight = 20,
      dropdownStyle,
      dropdownClassName,
      dropdownMatchSelectWidth,
      dropdownRender,

      // Tags
      maxTagCount,
      maxTagTextLength,
      maxTagPlaceholder,
      tokenSeparators,

      // Events
      onPopupScroll,
      onDropdownVisibleChange,

      labelInValue,
      className,
      open,
      defaultOpen,
      options,
      children,
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
    const listRef = React.useRef<RefProps>(null);

    // Inner id for accessibility usage. Only work in client side
    const [innerId, setInnerId] = React.useState<string>();
    React.useEffect(() => {
      setInnerId(`rc_select_${uuid}`);
      uuid += 1;
    }, []);
    const mergedId = id || innerId;

    // ============================= Option =============================
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
      const filteredOptions: OptionsType = filterOptions(mergedSearchValue, mergedOptions, props);
      if (mode === 'tags' && filteredOptions.every(opt => opt.value !== mergedSearchValue)) {
        filteredOptions.unshift({
          value: mergedSearchValue,
          label: mergedSearchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }

      return filteredOptions;
    }, [mergedOptions, mergedSearchValue, mode]);

    if (process.env.NODE_ENV !== 'production' && mode === 'tags') {
      warning(
        mergedOptions.every(opt => !opt.disabled),
        'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
      );
    }

    // ============================= Value ==============================
    const [innerValue, setInnerValue] = React.useState<ValueType>(value || defaultValue);
    const baseValue = value !== undefined && value !== null ? value : innerValue;

    /** Unique raw values */
    const mergedRawValue = React.useMemo<RawValueType[]>(
      () => toInnerValue(baseValue, { labelInValue }),
      [baseValue],
    );
    /** We cache a set of raw values to speed up check */
    const rawValues = React.useMemo<Set<RawValueType>>(() => new Set(mergedRawValue), [
      mergedRawValue,
    ]);

    const displayValues = React.useMemo<LabelValueType[]>(
      () =>
        mergedRawValue.map((val: RawValueType) =>
          getLabeledValue(val, {
            options: mergedOptions,
            prevValue: baseValue,
            labelInValue,
            optionLabelProp,
          }),
        ),
      [baseValue],
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
          labelInValue,
          options: mergedOptions,
          getLabeledValue,
          prevValue: baseValue,
          optionLabelProp,
        });

        triggerChange(outValue);
      }

      // Trigger `onSelect`
      const selectValue: any = labelInValue
        ? getLabeledValue(newValue, {
            options: mergedOptions,
            prevValue: baseValue,
            labelInValue,
            optionLabelProp,
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
      if (!isMultiple || autoClearSearchValue) {
        setInnerSearchValue('');
      }
    };

    // ============================= Search =============================
    const triggerSearch = (searchText: string) => {
      let newSearchText = searchText;

      // Check if match the `tokenSeparators`
      let patchRawValues: RawValueType[] = getSeparatedContent(searchText, tokenSeparators);

      if (patchRawValues) {
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
            labelInValue,
            getLabeledValue,
            options: mergedOptions,
            prevValue: baseValue,
            optionLabelProp,
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

    const onToggleOpen = React.useCallback<(open?: boolean) => void>(
      (newOpen?: boolean) => {
        const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;
        if (mergedOpen !== nextOpen && !disabled) {
          setInnerOpen(nextOpen);
          if (onDropdownVisibleChange) {
            onDropdownVisibleChange(nextOpen);
          }
        }
      },
      [mergedOpen, disabled],
    );

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
      if (
        which === KeyCode.BACKSPACE &&
        !clearLock &&
        isMultiple &&
        !mergedSearchValue &&
        mergedRawValue.length
      ) {
        triggerChange((baseValue as LabelValueType[]).slice(0, -1));
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

    const onActiveTitle = (index: number) => {
      setAccessibilityIndex(index);
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
        options={displayOptions}
        multiple={isMultiple}
        values={rawValues}
        height={listHeight}
        itemHeight={listItemHeight}
        onSelect={onInternalSelect}
        onToggleOpen={onToggleOpen}
        onActiveTitle={onActiveTitle}
        defaultActiveFirstOption={defaultActiveFirstOption}
        notFoundContent={notFoundContent}
        onScroll={onPopupScroll}
      />
    );

    // ============================= Clear ==============================
    let clearNode: React.ReactNode;
    const onClearClick: React.MouseEventHandler<HTMLSpanElement> = () => {
      triggerChange([]);
      triggerSearch('');
    };

    if (allowClear && (mergedRawValue.length || mergedSearchValue)) {
      clearNode = (
        <TransBtn
          className={`${prefixCls}-selection-clear`}
          onClick={onClearClick}
          customizeIcon={clearIcon}
        >
          ×
        </TransBtn>
      );
    }

    // ============================= Arrow ==============================
    const mergedShowArrow = showArrow !== undefined ? showArrow : !isMultiple;
    let arrowNode: React.ReactNode;

    if (mergedShowArrow) {
      arrowNode = (
        <TransBtn className={`${prefixCls}-selection-arrow`} customizeIcon={inputIcon}>
          ↓
        </TransBtn>
      );
    }

    // ============================= Render =============================
    const mergedClassName = classNames(prefixCls, className, {
      [`${prefixCls}-focused`]: mockFocused,
      [`${prefixCls}-multiple`]: isMultiple,
      [`${prefixCls}-allow-clear`]: allowClear,
      [`${prefixCls}-show-arrow`]: mergedShowArrow,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-open`]: mergedOpen,
    });

    return (
      <SelectContext.Provider value={{ prefixCls }}>
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
            dropdownStyle={dropdownStyle}
            dropdownClassName={dropdownClassName}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            dropdownRender={dropdownRender}
          >
            <Selector
              {...props}
              ref={selectorRef}
              id={mergedId}
              showSearch={showSearch}
              mode={mode}
              accessibilityIndex={accessibilityIndex}
              multiple={isMultiple}
              values={displayValues}
              open={mergedOpen}
              onToggleOpen={onToggleOpen}
              searchValue={mergedSearchValue}
              onSearch={triggerSearch}
              onSelect={onInternalSelect}
            />
          </SelectTrigger>

          {arrowNode}
          {clearNode}
        </div>
      </SelectContext.Provider>
    );
  }

  type SelectType = typeof Select & StaticProps;

  (Select as any).defaultProps = {
    optionFilterProp: 'value',
    optionLabelProp: 'label',
  };

  // Inject static props
  if (staticProps) {
    Object.keys(staticProps).forEach(prop => {
      Select[prop] = staticProps[prop];
    });
  }

  return Select as SelectType;
}

interface SelectStaticProps {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
}

export default generateSelector<SelectOptionsType, SelectStaticProps>({
  components: {
    optionList: SelectOptionList,
  },
  staticProps: {
    Option,
    OptGroup,
  },
  convertChildrenToData: convertSelectChildrenToData,
  getLabeledValue: getSelectLabeledValue,
  filterOptions: selectDefaultFilterOptions,
});
