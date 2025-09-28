import type { AlignType, BuildInPlacements } from '@rc-component/trigger/lib/interface';
import { clsx } from 'clsx';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import isMobile from '@rc-component/util/lib/isMobile';
import { useComposeRef } from '@rc-component/util/lib/ref';
import { getDOM } from '@rc-component/util/lib/Dom/findDOMNode';
import type { ScrollConfig, ScrollTo } from 'rc-virtual-list/lib/List';
import * as React from 'react';
import { useAllowClear } from '../hooks/useAllowClear';
import { BaseSelectContext } from '../hooks/useBaseProps';
import type { BaseSelectContextProps } from '../hooks/useBaseProps';
import useDelayReset from '../hooks/useDelayReset';
import useLock from '../hooks/useLock';
import useSelectTriggerControl from '../hooks/useSelectTriggerControl';
import type {
  DisplayInfoType,
  DisplayValueType,
  Mode,
  Placement,
  RawValueType,
  RenderDOMFunc,
  RenderNode,
} from '../interface';
import type { RefSelectorProps } from '../Selector';
import Selector from '../Selector';
import type { RefTriggerProps } from '../SelectTrigger';
import SelectTrigger from '../SelectTrigger';
import TransBtn from '../TransBtn';
import { getSeparatedContent, isValidCount } from '../utils/valueUtil';
import Polite from './Polite';
export type BaseSelectSemanticName = 'prefix' | 'suffix' | 'input';

export type {
  DisplayInfoType,
  DisplayValueType,
  Mode,
  Placement,
  RenderDOMFunc,
  RenderNode,
  RawValueType,
};

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
export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (args: number | ScrollConfig) => void;
}

export type CustomTagProps = {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
  isMaxTag: boolean;
  index: number;
};

export interface BaseSelectRef {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  scrollTo: ScrollTo;
  nativeElement: HTMLElement;
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
      type: DisplayInfoType;
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
  autoClearSearchValue?: boolean;
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

  // >>> Dropdown
  OptionList: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<any> & React.RefAttributes<RefOptionListProps>
  >;
  /** Tell if provided `options` is empty */
  emptyOptions: boolean;
}

export type BaseSelectPropsWithoutPrivate = Omit<BaseSelectProps, keyof BaseSelectPrivateProps>;

export interface BaseSelectProps extends BaseSelectPrivateProps, React.AriaAttributes {
  // Style
  className?: string;
  style?: React.CSSProperties;
  classNames?: Partial<Record<BaseSelectSemanticName, string>>;
  styles?: Partial<Record<BaseSelectSemanticName, React.CSSProperties>>;

  // Selector
  showSearch?: boolean;
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  direction?: 'ltr' | 'rtl';
  autoFocus?: boolean;
  placeholder?: React.ReactNode;
  maxCount?: number;

  // MISC
  title?: string;
  tabIndex?: number;
  notFoundContent?: React.ReactNode;
  onClear?: () => void;
  maxLength?: number;
  showScrollBar?: boolean | 'optional';

  choiceTransitionName?: string;

  // >>> Mode
  mode?: Mode;

  // >>> Status
  disabled?: boolean;
  loading?: boolean;

  // >>> Open
  open?: boolean;
  defaultOpen?: boolean;
  onPopupVisibleChange?: (open: boolean) => void;

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
  allowClear?: boolean | { clearIcon?: RenderNode };
  prefix?: React.ReactNode;
  suffixIcon?: RenderNode;
  /**
   * Clear all icon
   * @deprecated Please use `allowClear` instead
   **/
  clearIcon?: RenderNode;
  /** Selector remove icon */
  removeIcon?: RenderNode;

  // >>> Dropdown/Popup
  animation?: string;
  transitionName?: string;

  popupStyle?: React.CSSProperties;
  popupClassName?: string;
  popupMatchSelectWidth?: boolean | number;
  popupRender?: (menu: React.ReactElement) => React.ReactElement;
  popupAlign?: AlignType;

  placement?: Placement;
  builtinPlacements?: BuildInPlacements;
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
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const isMultiple = (mode: Mode) => mode === 'tags' || mode === 'multiple';

const BaseSelect = React.forwardRef<BaseSelectRef, BaseSelectProps>((props, ref) => {
  const {
    id,
    prefixCls,
    className,
    styles,
    classNames,
    showSearch,
    tagRender,
    showScrollBar = 'optional',
    direction,
    omitDomProps,

    // Value
    displayValues,
    onDisplayValuesChange,
    emptyOptions,
    notFoundContent = 'Not Found',
    onClear,
    maxCount,

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
    onPopupVisibleChange,

    // Active
    activeValue,
    onActiveValueChange,
    activeDescendantId,

    // Search
    searchValue,
    autoClearSearchValue,
    onSearch,
    onSearchSplit,
    tokenSeparators,

    // Icons
    allowClear,
    prefix,
    suffixIcon,
    clearIcon,

    // Dropdown
    OptionList,
    animation,
    transitionName,
    popupStyle,
    popupClassName,
    popupMatchSelectWidth,
    popupRender,
    popupAlign,
    placement,
    builtinPlacements,
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
  };

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
  const triggerRef = React.useRef<RefTriggerProps>(null);
  const selectorRef = React.useRef<RefSelectorProps>(null);
  const listRef = React.useRef<RefOptionListProps>(null);
  const blurRef = React.useRef<boolean>(false);
  const customDomRef = React.useRef<HTMLElement>(null);

  /** Used for component focused management */
  const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

  // =========================== Imperative ===========================
  React.useImperativeHandle(ref, () => ({
    focus: selectorRef.current?.focus,
    blur: selectorRef.current?.blur,
    scrollTo: (arg) => listRef.current?.scrollTo(arg),
    nativeElement:
      containerRef.current ||
      selectorRef.current?.nativeElement ||
      (getDOM(customDomRef.current) as HTMLElement),
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
    customDomRef,
    customizeRawInputElement?.props?.ref,
  );

  // ============================== Open ==============================
  // SSR not support Portal which means we need delay `open` for the first time render
  const [rendered, setRendered] = React.useState(false);
  useLayoutEffect(() => {
    setRendered(true);
  }, []);

  const [innerOpen, setInnerOpen] = useControlledState<boolean>(defaultOpen || false, open);

  let mergedOpen = rendered ? innerOpen : false;

  // Not trigger `open` in `combobox` when `notFoundContent` is empty
  const emptyListContent = !notFoundContent && emptyOptions;
  if (disabled || (emptyListContent && mergedOpen && mode === 'combobox')) {
    mergedOpen = false;
  }
  const triggerOpen = emptyListContent ? false : mergedOpen;

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (!disabled) {
        setInnerOpen(nextOpen);

        if (mergedOpen !== nextOpen) {
          onPopupVisibleChange?.(nextOpen);
        }
      }
    },
    [disabled, mergedOpen, setInnerOpen, onPopupVisibleChange],
  );

  // ============================= Search =============================
  const tokenWithEnter = React.useMemo<boolean>(
    () => (tokenSeparators || []).some((tokenSeparator) => ['\n', '\r\n'].includes(tokenSeparator)),
    [tokenSeparators],
  );

  const onInternalSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
    if (multiple && isValidCount(maxCount) && displayValues.length >= maxCount) {
      return;
    }
    let ret = true;
    let newSearchText = searchText;
    onActiveValueChange?.(null);

    const separatedList = getSeparatedContent(
      searchText,
      tokenSeparators,
      isValidCount(maxCount) ? maxCount - displayValues.length : undefined,
    );

    // Check if match the `tokenSeparators`
    const patchLabels: string[] = isCompositing ? null : separatedList;

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

    // After onBlur is triggered, the focused does not need to be reset
    if (disabled && !blurRef.current) {
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
  const keyLockRef = React.useRef(false);

  // KeyDown
  const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
    const clearLock = getClearLock();
    const { key } = event;

    const isEnterKey = key === 'Enter';

    if (isEnterKey) {
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
      key === 'Backspace' &&
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

    if (mergedOpen && (!isEnterKey || !keyLockRef.current)) {
      // Lock the Enter key after it is pressed to avoid repeated triggering of the onChange event.
      if (isEnterKey) {
        keyLockRef.current = true;
      }
      listRef.current?.onKeyDown(event, ...rest);
    }

    onKeyDown?.(event, ...rest);
  };

  // KeyUp
  const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
    if (mergedOpen) {
      listRef.current?.onKeyUp(event, ...rest);
    }
    if (event.key === 'Enter') {
      keyLockRef.current = false;
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

  const onInputBlur = () => {
    // Unlock the Enter key after the input blur; otherwise, the Enter key needs to be pressed twice to trigger the correct effect.
    keyLockRef.current = false;
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
    blurRef.current = true;

    setMockFocused(false, () => {
      focusRef.current = false;
      blurRef.current = false;
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
  const [, forceUpdate] = React.useState({});
  // We need force update here since popup dom is render async
  function onPopupMouseEnter() {
    forceUpdate({});
  }

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
    !!customizeRawInputElement,
  );

  // ============================ Context =============================
  const baseSelectContext = React.useMemo<BaseSelectContextProps>(
    () => ({
      ...props,
      notFoundContent,
      open: mergedOpen,
      triggerOpen,
      id,
      showSearch: mergedShowSearch,
      multiple,
      toggleOpen: onToggleOpen,
      showScrollBar,
      styles,
      classNames,
    }),
    [
      props,
      notFoundContent,
      triggerOpen,
      mergedOpen,
      id,
      mergedShowSearch,
      multiple,
      onToggleOpen,
      showScrollBar,
      styles,
      classNames,
    ],
  );

  // ==================================================================
  // ==                            Render                            ==
  // ==================================================================

  // ============================= Arrow ==============================
  const showSuffixIcon = !!suffixIcon || loading;
  let arrowNode: React.ReactNode;

  if (showSuffixIcon) {
    arrowNode = (
      <TransBtn
        className={clsx(`${prefixCls}-arrow`, classNames?.suffix, {
          [`${prefixCls}-arrow-loading`]: loading,
        })}
        style={styles?.suffix}
        customizeIcon={suffixIcon}
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
  const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
    onClear?.();

    selectorRef.current?.focus();

    onDisplayValuesChange([], {
      type: 'clear',
      values: displayValues,
    });
    onInternalSearch('', false, false);
  };

  const { allowClear: mergedAllowClear, clearIcon: clearNode } = useAllowClear(
    prefixCls,
    onClearMouseDown,
    displayValues,
    allowClear,
    clearIcon,
    disabled,
    mergedSearchValue,
    mode,
  );

  // =========================== OptionList ===========================
  const optionList = <OptionList ref={listRef} />;

  // ============================= Select =============================
  const mergedClassName = clsx(prefixCls, className, {
    [`${prefixCls}-focused`]: mockFocused,
    [`${prefixCls}-multiple`]: multiple,
    [`${prefixCls}-single`]: !multiple,
    [`${prefixCls}-allow-clear`]: allowClear,
    [`${prefixCls}-show-arrow`]: showSuffixIcon,
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
      animation={animation}
      transitionName={transitionName}
      popupStyle={popupStyle}
      popupClassName={popupClassName}
      direction={direction}
      popupMatchSelectWidth={popupMatchSelectWidth}
      popupRender={popupRender}
      popupAlign={popupAlign}
      placement={placement}
      builtinPlacements={builtinPlacements}
      getPopupContainer={getPopupContainer}
      empty={emptyOptions}
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
          prefixClassName={classNames?.prefix}
          prefixStyle={styles?.prefix}
          prefixCls={prefixCls}
          inputElement={customizeInputElement}
          ref={selectorRef}
          id={id}
          prefix={prefix}
          showSearch={mergedShowSearch}
          autoClearSearchValue={autoClearSearchValue}
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
          onInputBlur={onInputBlur}
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
        <Polite visible={mockFocused && !mergedOpen} values={displayValues} />
        {selectorNode}
        {arrowNode}
        {mergedAllowClear && clearNode}
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
