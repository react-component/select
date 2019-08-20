import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import Selector, { RefSelectorProps } from './Selector';
import SelectTrigger from './SelectTrigger';
import { SelectContext } from './Context';
import { RenderNode, OptionsType as SelectOptionsType } from './interface';
import {
  RawValueType,
  LabelValueType,
  ValueType,
  GetLabeledValue,
  FilterOptions,
  FilterFunc,
} from './interface/generator';
import SelectOptionList, { OptionListProps, RefProps } from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import { convertChildrenToData as convertSelectChildrenToData } from './utils/legacyUtil';
import {
  getLabeledValue as getSelectLabeledValue,
  filterOptions as selectDefaultFilterOptions,
} from './utils/valueUtil';
import { toInnerValue, toOuterValues } from './utils/commonUtil';
import TransBtn from './TransBtn';

/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

export interface SelectProps<OptionsType> {
  prefixCls?: string;
  id?: string;
  className?: string;

  // Options
  options?: OptionsType;
  children?: React.ReactNode;
  mode?: 'multiple' | 'tags' | 'combobox';

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
  clearIcon?: React.ReactNode;

  // Others
  autoFocus?: boolean;
  allowClear?: boolean;

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;

  // Legacy
  defaultActiveFirstOption?: boolean;
  combobox?: boolean;

  showSearch?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  showArrow?: boolean;
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
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onSelect?: (value: ValueType, option: JSX.Element | JSX.Element[]) => void;
  onDropdownVisibleChange?: (open: boolean | undefined) => void;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  onDeselect?: (value: ValueType, option: JSX.Element | JSX.Element[]) => void;
  loading?: boolean;
  firstActiveValue?: ValueType;
  dropdownStyle?: React.CSSProperties;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: RenderNode;
  tokenSeparators?: string[];
  getInputElement?: () => JSX.Element;
  showAction?: string[];
  inputIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  menuItemSelectedIcon?: RenderNode;
  getPopupContainer?: RenderNode;
  dropdownRender?: (menu: any) => JSX.Element;
  backfill?: boolean;
  dropdownAlign?: any;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean;
  dropdownMenuStyle?: React.CSSProperties;
  notFoundContent?: string | false;
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
export function generateSelector<OptionsType, StaticProps>(
  config: GenerateConfig<OptionsType, StaticProps>,
): React.ComponentType<SelectProps<OptionsType>> {
  /** Used for accessibility id generate */
  let uuid = 0;

  const {
    components: { optionList: OptionList },
    staticProps,
    convertChildrenToData,
    getLabeledValue,
    filterOptions,
  } = config;

  type SelectComponent = React.FC<SelectProps<OptionsType>> & StaticProps;

  const Select: React.FC<SelectProps<OptionsType>> = props => {
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

      disabled,
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

    const baseOptions = React.useMemo<OptionsType>((): OptionsType => {
      if (options !== undefined) {
        return options;
      }

      return convertChildrenToData(children);
    }, [options, children]);

    const mergedOptions = React.useMemo<OptionsType>(() => {
      if (!mergedSearchValue) {
        return baseOptions;
      }
      return filterOptions(mergedSearchValue, baseOptions, props);
    }, [baseOptions, mergedSearchValue]);

    const triggerSearch = (searchText: string) => {
      setInnerSearchValue(searchText);

      if (onSearch && mergedSearchValue !== searchText) {
        onSearch(searchText);
      }
    };

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
        mergedRawValue.map((val: RawValueType) => getLabeledValue(val, mergedOptions, baseValue)),
      [baseValue],
    );

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const triggerChange = React.useCallback(
      (values: RawValueType[] | LabelValueType[]) => {
        const outValue: ValueType = isMultiple ? values : values[0];
        // Skip trigger if prev & current value is both empty
        if (onChange && (mergedRawValue.length !== 0 || values.length !== 0)) {
          // TODO: handle this
          onChange(outValue, null);
        }

        setInnerValue(outValue);
      },
      [onChange, isMultiple, mergedRawValue],
    );

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
        });

        triggerChange(outValue);
      }

      // Trigger `onSelect`
      const selectValue = labelInValue
        ? getLabeledValue(newValue, mergedOptions, baseValue)
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

    // ============================== Open ==============================
    const [innerOpen, setInnerOpen] = React.useState<boolean>(defaultOpen);
    const mergeOpen: boolean = open !== undefined ? open : innerOpen;

    const onToggleOpen = React.useCallback<(open?: boolean) => void>(
      (newOpen?: boolean) => {
        const nextOpen = newOpen !== undefined ? newOpen : !mergeOpen;
        if (innerOpen !== nextOpen) {
          setInnerOpen(nextOpen);
        }
      },
      [innerOpen],
    );

    // KeyDown
    const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
      const { which } = event;

      // We only manage open state here, close logic should handle by list component
      if (!mergeOpen && which === KeyCode.ENTER) {
        onToggleOpen(true);
      }

      if (mergeOpen && listRef.current) {
        listRef.current.onKeyDown(event, ...rest);
      }

      if (onKeyDown) {
        onKeyDown(event, ...rest);
      }
    };

    // KeyUp
    const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
      if (mergeOpen && listRef.current) {
        listRef.current.onKeyUp(event, ...rest);
      }

      if (onKeyUp) {
        onKeyUp(event, ...rest);
      }
    };

    // ========================== Focus / Blur ==========================
    const [focused, setFocused] = React.useState(false);

    const onInternalFocus = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
      (...args) => {
        setFocused(true);
        if (onFocus) {
          onFocus(...args);
        }
      },
      [onFocus],
    );
    const onInternalBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
      (...args) => {
        setFocused(false);

        // TODO: cancel comment this
        // setInnerOpen(false);
        if (onBlur) {
          onBlur(...args);
        }
      },
      [onBlur],
    );

    const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (...args) => {
      // Not lose focus if have
      if (focused && args[0].target !== selectorRef.current.getInputElement()) {
        args[0].preventDefault();
      }

      if (onMouseDown) {
        onMouseDown(...args);
      }
    };

    // ============================= Popup ==============================
    const popupNode = (
      <OptionList
        ref={listRef}
        prefixCls={prefixCls}
        id={mergedId}
        options={mergedOptions}
        multiple={isMultiple}
        values={rawValues}
        onSelect={onInternalSelect}
        onToggleOpen={onToggleOpen}
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
        />
      );
    }

    // ============================= Render =============================
    const mergedClassName = classNames(prefixCls, className, {
      [`${prefixCls}-focused`]: focused,
      [`${prefixCls}-multiple`]: isMultiple,
      [`${prefixCls}-allow-clear`]: allowClear,
    });

    return (
      <SelectContext.Provider value={{ prefixCls }}>
        <div
          className={mergedClassName}
          {...domProps}
          onMouseDown={onInternalMouseDown}
          onKeyDown={onInternalKeyDown}
          onKeyUp={onInternalKeyUp}
        >
          {mergeOpen && (
            <span
              style={{ width: 0, height: 0, display: 'flex', overflow: 'hidden', opacity: 0 }}
              aria-live="assertive"
            >
              TODO: Options
            </span>
          )}
          <SelectTrigger
            disabled={disabled}
            prefixCls={prefixCls}
            visible={mergeOpen}
            popupElement={popupNode}
          >
            <Selector
              {...props}
              ref={selectorRef}
              id={mergedId}
              multiple={isMultiple}
              values={displayValues}
              open={mergeOpen}
              onToggleOpen={onToggleOpen}
              onFocus={onInternalFocus}
              onBlur={onInternalBlur}
              searchValue={mergedSearchValue}
              onSearch={triggerSearch}
            />
          </SelectTrigger>

          {clearNode}
        </div>
      </SelectContext.Provider>
    );
  };

  Select.defaultProps = {
    optionFilterProp: 'value',
  };

  // Inject static props
  if (staticProps) {
    Object.keys(staticProps).forEach(prop => {
      Select[prop] = staticProps[prop];
    });
  }

  return Select as SelectComponent;
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
