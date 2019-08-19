import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import classNames from 'classnames';
import Selector from './Selector';
import SelectTrigger from './SelectTrigger';
import { SelectContext } from './Context';
import {
  ValueType,
  RenderNode,
  OptionsType as SelectOptionsType,
  OptionsType,
  RawValueType,
} from './interface';
import OptionList, { OptionListProps, RefProps } from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import { convertChildrenToData as convertSelectChildrenToData } from './utils/legacyUtil';
import { toInnerValue, isSameValue, toOuterValue } from './utils/valueUtil';

/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

export interface SelectProps<OptionsType> {
  id?: string;

  // Options
  options?: OptionsType;
  children?: React.ReactNode;
  mode?: 'multiple' | 'tags';

  // Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;

  // Legacy

  defaultActiveFirstOption?: boolean;
  combobox?: boolean;
  autoClearSearchValue?: boolean;
  filterOption?: boolean | ((inputValue: string, option?: any) => boolean);
  showSearch?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  allowClear?: boolean;
  showArrow?: boolean;
  openClassName?: string;
  autoFocus?: boolean;
  prefixCls?: string;
  className?: string;
  transitionName?: string;
  optionLabelProp?: string;
  optionFilterProp?: string;
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
  onSearch?: (value: string) => void;
  onDropdownVisibleChange?: (open: boolean | undefined) => void;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  onDeselect?: (value: ValueType, option: JSX.Element | JSX.Element[]) => void;
  labelInValue?: boolean;
  loading?: boolean;
  value?: ValueType;
  firstActiveValue?: ValueType;
  defaultValue?: ValueType;
  dropdownStyle?: React.CSSProperties;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: RenderNode;
  tokenSeparators?: string[];
  getInputElement?: () => JSX.Element;
  showAction?: string[];
  clearIcon?: React.ReactNode;
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
  convertChildrenToData: (children: React.ReactNode) => OptionsType;
}

/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */
export function generateSelector<OptionsType, StaticProps>(
  config: GenerateConfig<OptionsType, StaticProps>,
): React.ComponentType<SelectProps<OptionsType>> {
  /** Used for accessibility id generate */
  let uuid: number = 0;

  const {
    components: { optionList: OptionList },
    staticProps,
    convertChildrenToData,
  } = config;

  type SelectComponent = React.FC<SelectProps<OptionsType>> & StaticProps;

  const Select: React.FC<SelectProps<OptionsType>> = props => {
    const {
      prefixCls = 'rc-select',

      mode,
      value,
      defaultValue,

      showSearch,
      id,
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

    const listRef = React.useRef<RefProps>(null);

    // Inner id for accessibility usage
    const [innerId, setInnerId] = React.useState<string>();
    React.useEffect(() => {
      setInnerId(`rc_select_${uuid}`);
      uuid += 1;
    }, []);
    const mergedId = id || innerId;

    // ============================= Option =============================
    const innerOptions = React.useMemo<OptionsType>((): OptionsType => {
      if (options !== undefined) {
        return options;
      }

      return convertChildrenToData(children);
    }, [options, children]);

    // ============================= Value ==============================
    const [innerValue, setInnerValue] = React.useState<ValueType>(value || defaultValue);
    const baseValue = value !== undefined && value !== null ? value : innerValue;
    const mergedRawValue = React.useMemo<Set<RawValueType>>(
      () => new Set(toInnerValue(baseValue, { labelInValue })),
      [baseValue],
    );

    const isMultiple = mode === 'tags' || mode === 'multiple';

    const onInternalSelect = (newValue: RawValueType, { selected }: { selected: boolean }) => {
      const cloneRawValue = new Set(mergedRawValue);

      if (selected) {
        cloneRawValue.add(newValue);
      } else {
        cloneRawValue.delete(newValue);
      }

      // Don't care is add or remove, just trigger if size changed
      if (mergedRawValue.size !== cloneRawValue.size && onChange) {
        // TODO: handle multiple & labelInValue
        const outValue = toOuterValue(Array.from(cloneRawValue), { multiple: false, labelInValue });
        onChange(outValue, null);

        setInnerValue(outValue);
      }

      // TODO: handle label in value
      if (selected && onSelect) {
        onSelect(newValue, null);
      } else if (!selected && onDeselect) {
        onDeselect(newValue, null);
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
      if (!mergeOpen && (which === KeyCode.SPACE || which === KeyCode.ENTER)) {
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
      if (focused) {
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
        options={innerOptions}
        multiple={isMultiple}
        values={mergedRawValue}
        onSelect={onInternalSelect}
        onToggleOpen={onToggleOpen}
      />
    );

    // ============================= Render =============================
    const mergedClassName = classNames(prefixCls, className, {
      [`${prefixCls}-focused`]: focused,
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
              id={mergedId}
              open={mergeOpen}
              onToggleOpen={onToggleOpen}
              onFocus={onInternalFocus}
              onBlur={onInternalBlur}
            />
          </SelectTrigger>
        </div>
      </SelectContext.Provider>
    );
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

export default generateSelector<OptionsType, SelectStaticProps>({
  components: {
    optionList: OptionList,
  },
  staticProps: {
    Option,
    OptGroup,
  },
  convertChildrenToData: convertSelectChildrenToData,
});
