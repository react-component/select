import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import isMobile from 'rc-util/lib/isMobile';
import { useComposeRef } from 'rc-util/lib/ref';
import type { ScrollTo } from 'rc-virtual-list/lib/List';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { getSeparatedContent } from './utils/valueUtil';
import type { RefTriggerProps } from './SelectTrigger';
import SelectTrigger from './SelectTrigger';
import type { RefSelectorProps } from './Selector';
import Selector from './Selector';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useDelayReset from './hooks/useDelayReset';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import { BaseSelectContext } from './hooks/useBaseProps';

const DEFAULT_OMIT_PROPS = [
  'value',
  'onChange',
  'removeIcon',
  'placeholder',
  'autoFocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'onPopupScroll',
  'tabIndex',
] as const;

export type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export type RenderDOMFunc = (props: any) => HTMLElement;

export type Mode = 'multiple' | 'tags' | 'combobox';

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type RawValueType = string | number;

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (index: number) => void;
}

export type CustomTagProps = {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
};

export interface DisplayValueType {
  key?: React.Key;
  value?: RawValueType;
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface BaseSelectRef {
  focus: () => void;
  blur: () => void;
  scrollTo: ScrollTo;
}

export interface BaseSelectPrivateProps {
  // >>> MISC
  id: string;
  prefixCls: string;
  omitDomProps?: string[];

  // >>> Value
  displayValues: DisplayValueType[];
  onDisplayValuesChange: (
    values: DisplayValueType[],
    info: {
      type: 'add' | 'remove' | 'clear';
      values: DisplayValueType[];
    },
  ) => void;

  // >>> Active
  /** Current dropdown list active item string value */
  activeValue?: string;
  /** Link search input with target element */
  activeDescendantId?: string;
  onActiveValueChange?: (value: string | null) => void;

  // >>> Search
  searchValue: string;
  /** Trigger onSearch, return false to prevent trigger open event */
  onSearch: (
    searchValue: string,
    info: {
      source:
        | 'typing' //User typing
        | 'effect' // Code logic trigger
        | 'submit' // tag mode only
        | 'blur'; // Not trigger event
    },
  ) => void;
  /** Trigger when search text match the `tokenSeparators`. Will provide split content */
  onSearchSplit?: (words: string[]) => void;
  maxLength?: number;

  // >>> Dropdown
  OptionList: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<any> & React.RefAttributes<RefOptionListProps>
  >;
  /** Tell if provided `options` is empty */
  emptyOptions: boolean;
}

export type BaseSelectPropsWithoutPrivate = Omit<BaseSelectProps, keyof BaseSelectPrivateProps>;

export interface BaseSelectProps extends BaseSelectPrivateProps, React.AriaAttributes {
  className?: string;
  style?: React.CSSProperties;
  showSearch?: boolean;
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  direction?: 'ltr' | 'rtl';

  // MISC
  tabIndex?: number;
  autoFocus?: boolean;
  notFoundContent?: React.ReactNode;
  placeholder?: React.ReactNode;
  onClear?: () => void;

  choiceTransitionName?: string;

  // >>> Mode
  mode?: Mode;

  // >>> Status
  disabled?: boolean;
  loading?: boolean;

  // >>> Open
  open?: boolean;
  defaultOpen?: boolean;
  onDropdownVisibleChange?: (open: boolean) => void;

  // >>> Customize Input
  /** @private Internal usage. Do not use in your production. */
  getInputElement?: () => JSX.Element;
  /** @private Internal usage. Do not use in your production. */
  getRawInputElement?: () => JSX.Element;

  // >>> Selector
  maxTagTextLength?: number;
  maxTagCount?: number | 'responsive';
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: DisplayValueType[]) => React.ReactNode);

  // >>> Search
  tokenSeparators?: string[];

  // >>> Icons
  allowClear?: boolean;
  showArrow?: boolean;
  inputIcon?: RenderNode;
  /** Clear all icon */
  clearIcon?: RenderNode;
  /** Selector remove icon */
  removeIcon?: RenderNode;

  // >>> Dropdown
  animation?: string;
  transitionName?: string;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  dropdownAlign?: any;
  placement?: Placement;
  getPopupContainer?: RenderDOMFunc;

  // >>> Focus
  showAction?: ('focus' | 'click')[];
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;

  // >>> Rest Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export function isMultiple(mode: Mode) {
  return mode === 'tags' || mode === 'multiple';
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    id,
    prefixCls,
    className,
    showSearch,
    tagRender,
    direction,
    omitDomProps,

    // Value
    displayValues,
    onDisplayValuesChange,
    emptyOptions,
    notFoundContent = 'Not Found',
    onClear,

    // Mode
    mode,

    // Status
    disabled,
    loading,

    // Customize Input
    getInputElement,
    getRawInputElement,

    // Open
    open,
    defaultOpen,
    onDropdownVisibleChange,

    // Active
    activeValue,
    onActiveValueChange,
    activeDescendantId,

    // Search
    searchValue,
    onSearch,
    onSearchSplit,
    tokenSeparators,

    // Icons
    allowClear,
    showArrow,
    inputIcon,
    clearIcon,

    // Dropdown
    OptionList,
    animation,
    transitionName,
    dropdownStyle,
    dropdownClassName,
    dropdownMatchSelectWidth,
    dropdownRender,
    dropdownAlign,
    placement,
    getPopupContainer,

    // Focus
    showAction = [],
    onFocus,
    onBlur,

    // Rest Events
    onKeyUp,
    onKeyDown,
    onMouseDown,

    // Rest Props
    ...restProps
  } = props;

  // ============================== MISC ==============================
  const multiple = isMultiple(mode);
  const mergedShowSearch =
    (showSearch !== undefined ? showSearch : multiple) || mode === 'combobox';

  const domProps = {
    ...restProps,
  } as Omit<keyof typeof restProps, typeof DEFAULT_OMIT_PROPS[number]>;

  DEFAULT_OMIT_PROPS.forEach((propName) => {
    delete domProps[propName];
  });

  omitDomProps?.forEach((propName) => {
    delete domProps[propName];
  });

  // ============================= Mobile =============================
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    // Only update on the client side
    setMobile(isMobile());
  }, []);

  // ============================== Refs ==============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectorDomRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<RefTriggerProps>(null);
  const selectorRef = React.useRef<RefSelectorProps>(null);
  const listRef = React.useRef<RefOptionListProps>(null);

  /** Used for component focused management */
  const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

  // =========================== Imperative ===========================
  React.useImperativeHandle(ref, () => ({
    focus: selectorRef.current?.focus,
    blur: selectorRef.current?.blur,
    scrollTo: (arg) => listRef.current?.scrollTo(arg as any),
  }));

  // ========================== Search Value ==========================
  const mergedSearchValue = React.useMemo(() => {
    if (mode !== 'combobox') {
      return searchValue;
    }

    const val = displayValues[0]?.value;

    return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
  }, [searchValue, mode, displayValues]);

  // ========================== Custom Input ==========================
  // Only works in `combobox`
  const customizeInputElement: React.ReactElement =
    (mode === 'combobox' && typeof getInputElement === 'function' && getInputElement()) || null;

  // Used for customize replacement for `rc-cascader`
  const customizeRawInputElement: React.ReactElement =
    typeof getRawInputElement === 'function' && getRawInputElement();

  const customizeRawInputRef = useComposeRef<HTMLElement>(
    selectorDomRef,
    customizeRawInputElement?.props?.ref,
  );

  // ============================== Open ==============================
  const [innerOpen, setInnerOpen] = useMergedState<boolean>(undefined, {
    defaultValue: defaultOpen,
    value: open,
  });

  let mergedOpen = innerOpen;

  // Not trigger `open` in `combobox` when `notFoundContent` is empty
  const emptyListContent = !notFoundContent && emptyOptions;
  if (disabled || (emptyListContent && mergedOpen && mode === 'combobox')) {
    mergedOpen = false;
  }
  const triggerOpen = emptyListContent ? false : mergedOpen;

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (mergedOpen !== nextOpen && !disabled) {
        setInnerOpen(nextOpen);
        onDropdownVisibleChange?.(nextOpen);
      }
    },
    [disabled, mergedOpen, setInnerOpen, onDropdownVisibleChange],
  );

  // ============================= Search =============================
  const tokenWithEnter = React.useMemo(
    () => (tokenSeparators || []).some((tokenSeparator) => ['\n', '\r\n'].includes(tokenSeparator)),
    [tokenSeparators],
  );

  const onInternalSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
    let ret = true;
    let newSearchText = searchText;
    onActiveValueChange?.(null);

    // Check if match the `tokenSeparators`
    const patchLabels: string[] = isCompositing
      ? null
      : getSeparatedContent(searchText, tokenSeparators);

    // Ignore combobox since it's not split-able
    if (mode !== 'combobox' && patchLabels) {
      newSearchText = '';

      onSearchSplit?.(patchLabels);

      // Should close when paste finish
      onToggleOpen(false);

      // Tell Selector that break next actions
      ret = false;
    }

    if (onSearch && mergedSearchValue !== newSearchText) {
      onSearch(newSearchText, {
        source: fromTyping ? 'typing' : 'effect',
      });
    }

    return ret;
  };

  // Only triggered when menu is closed & mode is tags
  // If menu is open, OptionList will take charge
  // If mode isn't tags, press enter is not meaningful when you can't see any option
  const onInternalSearchSubmit = (searchText: string) => {
    // prevent empty tags from appearing when you click the Enter button
    if (!searchText || !searchText.trim()) {
      return;
    }
    onSearch(searchText, { source: 'submit' });
  };

  // Close will clean up single mode search text
  React.useEffect(() => {
    if (!mergedOpen && !multiple && mode !== 'combobox') {
      onInternalSearch('', false, false);
    }
  }, [mergedOpen]);

  // ============================ Disabled ============================
  // Close dropdown & remove focus state when disabled change
  React.useEffect(() => {
    if (innerOpen && disabled) {
      setInnerOpen(false);
    }

    if (disabled) {
      setMockFocused(false);
    }
  }, [disabled]);

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
      multiple &&
      !mergedSearchValue &&
      displayValues.length
    ) {
      const cloneDisplayValues = [...displayValues];
      let removedDisplayValue = null;

      for (let i = cloneDisplayValues.length - 1; i >= 0; i -= 1) {
        const current = cloneDisplayValues[i];

        if (!current.disabled) {
          cloneDisplayValues.splice(i, 1);
          removedDisplayValue = current;
          break;
        }
      }

      if (removedDisplayValue) {
        onDisplayValuesChange(cloneDisplayValues, {
          type: 'remove',
          values: [removedDisplayValue],
        });
      }
    }

    if (mergedOpen && listRef.current) {
      listRef.current.onKeyDown(event, ...rest);
    }

    onKeyDown?.(event, ...rest);
  };

  // KeyUp
  const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
    if (mergedOpen && listRef.current) {
      listRef.current.onKeyUp(event, ...rest);
    }

    onKeyUp?.(event, ...rest);
  };

  // ============================ Selector ============================
  const onSelectorRemove = (val: DisplayValueType) => {
    const newValues = displayValues.filter((i) => i !== val);

    onDisplayValuesChange(newValues, {
      type: 'remove',
      values: [val],
    });
  };

  // ========================== Focus / Blur ==========================
  /** Record real focus status */
  const focusRef = React.useRef<boolean>(false);

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
        onSearch(mergedSearchValue, { source: 'submit' });
      } else if (mode === 'multiple') {
        // `multiple` mode only clean the search value but not trigger event
        onSearch('', {
          source: 'blur',
        });
      }
    }

    if (onBlur) {
      onBlur(...args);
    }
  };

  // Give focus back of Select
  const activeTimeoutIds: any[] = [];
  React.useEffect(
    () => () => {
      activeTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    },
    [],
  );

  const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (event, ...restArgs) => {
    const { target } = event;
    const popupElement: HTMLDivElement = triggerRef.current?.getPopupElement();

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

    onMouseDown?.(event, ...restArgs);
  };

  // ============================ Dropdown ============================
  const [containerWidth, setContainerWidth] = React.useState(null);

  const [, forceUpdate] = React.useState({});
  // We need force update here since popup dom is render async
  function onPopupMouseEnter() {
    forceUpdate({});
  }

  useLayoutEffect(() => {
    if (triggerOpen) {
      const newWidth = Math.ceil(containerRef.current?.offsetWidth);
      if (containerWidth !== newWidth && !Number.isNaN(newWidth)) {
        setContainerWidth(newWidth);
      }
    }
  }, [triggerOpen]);

  // Used for raw custom input trigger
  let onTriggerVisibleChange: null | ((newOpen: boolean) => void);
  if (customizeRawInputElement) {
    onTriggerVisibleChange = (newOpen: boolean) => {
      onToggleOpen(newOpen);
    };
  }

  // Close when click on non-select element
  useSelectTriggerControl(
    () => [containerRef.current, triggerRef.current?.getPopupElement()],
    triggerOpen,
    onToggleOpen,
  );

  // ============================ Context =============================
  const baseSelectContext = React.useMemo(
    () => ({
      ...props,
      notFoundContent,
      open: mergedOpen,
      triggerOpen,
      id,
      showSearch: mergedShowSearch,
      multiple,
      toggleOpen: onToggleOpen,
    }),
    [props, notFoundContent, triggerOpen, mergedOpen, id, mergedShowSearch, multiple, onToggleOpen],
  );

  // ==================================================================
  // ==                            Render                            ==
  // ==================================================================

  // ============================= Arrow ==============================
  const mergedShowArrow =
    showArrow !== undefined ? showArrow : loading || (!multiple && mode !== 'combobox');
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

  // ============================= Clear ==============================
  let clearNode: React.ReactNode;
  const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
    onClear?.();

    onDisplayValuesChange([], {
      type: 'clear',
      values: displayValues,
    });
    onInternalSearch('', false, false);
  };

  if (!disabled && allowClear && (displayValues.length || mergedSearchValue)) {
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

  // =========================== OptionList ===========================
  const optionList = <OptionList ref={listRef} />;

  // ============================= Select =============================
  const mergedClassName = classNames(prefixCls, className, {
    [`${prefixCls}-focused`]: mockFocused,
    [`${prefixCls}-multiple`]: multiple,
    [`${prefixCls}-single`]: !multiple,
    [`${prefixCls}-allow-clear`]: allowClear,
    [`${prefixCls}-show-arrow`]: mergedShowArrow,
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-open`]: mergedOpen,
    [`${prefixCls}-customize-input`]: customizeInputElement,
    [`${prefixCls}-show-search`]: mergedShowSearch,
  });

  // >>> Selector
  const selectorNode = (
    <SelectTrigger
      ref={triggerRef}
      disabled={disabled}
      prefixCls={prefixCls}
      visible={triggerOpen}
      popupElement={optionList}
      containerWidth={containerWidth}
      animation={animation}
      transitionName={transitionName}
      dropdownStyle={dropdownStyle}
      dropdownClassName={dropdownClassName}
      direction={direction}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      dropdownRender={dropdownRender}
      dropdownAlign={dropdownAlign}
      placement={placement}
      getPopupContainer={getPopupContainer}
      empty={emptyOptions}
      getTriggerDOMNode={() => selectorDomRef.current}
      onPopupVisibleChange={onTriggerVisibleChange}
      onPopupMouseEnter={onPopupMouseEnter}
    >
      {customizeRawInputElement ? (
        React.cloneElement(customizeRawInputElement, {
          ref: customizeRawInputRef,
        })
      ) : (
        <Selector
          {...props}
          domRef={selectorDomRef}
          prefixCls={prefixCls}
          inputElement={customizeInputElement}
          ref={selectorRef}
          id={id}
          showSearch={mergedShowSearch}
          mode={mode}
          activeDescendantId={activeDescendantId}
          tagRender={tagRender}
          values={displayValues}
          open={mergedOpen}
          onToggleOpen={onToggleOpen}
          activeValue={activeValue}
          searchValue={mergedSearchValue}
          onSearch={onInternalSearch}
          onSearchSubmit={onInternalSearchSubmit}
          onRemove={onSelectorRemove}
          tokenWithEnter={tokenWithEnter}
        />
      )}
    </SelectTrigger>
  );

  // >>> Render
  let renderNode: React.ReactNode;

  // Render raw
  if (customizeRawInputElement) {
    renderNode = selectorNode;
  } else {
    renderNode = (
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
            {`${displayValues
              .map(({ label, value }) =>
                ['number', 'string'].includes(typeof label) ? label : value,
              )
              .join(', ')}`}
          </span>
        )}
        {selectorNode}

        {arrowNode}
        {clearNode}
      </div>
    );
  }

  return (
    <BaseSelectContext.Provider value={baseSelectContext}>{renderNode}</BaseSelectContext.Provider>
  );
});

// Set display name for dev
if (process.env.NODE_ENV !== 'production') {
  BaseSelect.displayName = 'BaseSelect';
}

export default BaseSelect;
