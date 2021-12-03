import * as React from 'react';
import classNames from 'classnames';
import isMobile from 'rc-util/lib/isMobile';
import { useComposeRef } from 'rc-util/lib/ref';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { getSeparatedContent } from './utils/valueUtil';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import Selector, { RefSelectorProps } from './Selector';
import useId from './hooks/useId';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useDelayReset from './hooks/useDelayReset';
import TransBtn from './TransBtn';

export type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export type RenderDOMFunc = (props: any) => HTMLElement;

export type Mode = 'multiple' | 'tags' | 'combobox';

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type RawValueType = string | number;

export type CustomTagProps = {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
};

export interface LabelValueType {
  key?: React.Key;
  value?: RawValueType;
  label?: React.ReactNode;
  isCacheable?: boolean;
}

export interface BaseSelectProps {
  prefixCls: string;
  className: string;
  id?: string;
  showSearch?: boolean;
  multiple?: boolean;
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  displayValues?: LabelValueType[];
  direction?: 'ltr' | 'rtl';

  // Value
  emptyOptions?: boolean;
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  notFoundContent?: React.ReactNode;

  // Mode
  mode?: Mode;

  // Status
  disabled?: boolean;
  loading?: boolean;

  // Open
  open?: boolean;
  defaultOpen?: boolean;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Customize Input
  /** @private Internal usage. Do not use in your production. */
  getInputElement?: () => JSX.Element;
  /** @private Internal usage. Do not use in your production. */
  getRawInputElement?: () => JSX.Element;

  // Active
  /** Current dropdown list active item string value */
  activeValue?: string;
  // TODO: handle this
  /** Link search input with target element */
  activeDescendantId?: string;
  onActiveValueChange?: (value: string | null) => void;

  // Search
  searchValue: string;
  /** Trigger onSearch, return false to prevent trigger open event */
  onSearch: (
    searchValue: string,
    info: {
      source: 'typing' | 'effect' | 'submit' | 'clear';
    },
  ) => void;
  /** Trigger when search text match the `tokenSeparators`. Will provide split content */
  onSearchSplit: (words: string[]) => void;
  /** Only used for tag mode. Check if separator has \r\n */
  tokenWithEnter?: boolean;
  tokenSeparators?: string[];

  // Icons
  allowClear?: boolean;
  showArrow?: boolean;
  inputIcon?: RenderNode;

  // Dropdown
  animation?: string;
  transitionName?: string;
  dropdownContent?: React.ReactElement;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  dropdownAlign?: any;
  placement?: Placement;
  getPopupContainer?: RenderDOMFunc;
  dropdownEmpty?: boolean;

  // Focus
  showAction?: ('focus' | 'click')[];
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;

  // Rest Events
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: any) => {
  const {
    id,
    prefixCls,
    className,
    showSearch,
    multiple,
    tagRender,
    displayValues,
    direction,

    // Value
    onSelect,
    emptyOptions,
    notFoundContent = 'Not Found',

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
    tokenWithEnter,
    searchValue,
    onSearch,
    onSearchSplit,
    tokenSeparators,

    // Icons
    allowClear,
    showArrow,
    inputIcon,

    // Dropdown
    animation,
    transitionName,
    dropdownContent,
    dropdownStyle,
    dropdownClassName,
    dropdownMatchSelectWidth,
    dropdownRender,
    dropdownAlign,
    dropdownEmpty,
    placement,
    getPopupContainer,

    // Focus
    showAction = [],
    onFocus,
    onBlur,

    // Rest Events
    onMouseDown,
  } = props;

  // ============================== MISC ==============================
  const mergedId = useId(id);
  const isMultiple = mode === 'tags' || mode === 'multiple';
  const mergedShowSearch =
    (showSearch !== undefined ? showSearch : isMultiple) || mode === 'combobox';

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
  // const listRef = React.useRef<RefOptionListProps>(null);

  /** Used for component focused management */
  const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

  // =========================== Imperative ===========================
  React.useImperativeHandle(ref, () => ({
    focus: selectorRef.current?.focus,
    blur: selectorRef.current?.blur,
    // TODO: handle this
    // scrollTo: listRef.current?.scrollTo as ScrollTo,
  }));

  // ========================== Custom Input ==========================
  // Only works in `combobox`
  const customizeInputElement: React.ReactElement =
    (mode === 'combobox' && typeof getInputElement === 'function' && getInputElement()) || null;

  // Used for customize replacement for `rc-cascader`
  const customizeRawInputElement: React.ReactElement =
    typeof getRawInputElement === 'function' && getRawInputElement();

  const customizeRawInputRef = useComposeRef<HTMLElement>(
    selectorDomRef,
    customizeRawInputElement.props.ref,
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

  const onToggleOpen = (newOpen?: boolean) => {
    const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

    if (mergedOpen !== nextOpen && !disabled) {
      setInnerOpen(nextOpen);
      onDropdownVisibleChange?.(nextOpen);
    }
  };

  // ============================= Search =============================
  const onInternalSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
    let ret = true;
    let newSearchText = searchText;
    onActiveValueChange(null);

    // Check if match the `tokenSeparators`
    const patchLabels: string[] = isCompositing
      ? null
      : getSeparatedContent(searchText, tokenSeparators);

    if (mode === 'combobox') {
      // Only typing will trigger onChange
      if (fromTyping) {
        onSearch(newSearchText, { source: 'typing' });
      }
    } else if (patchLabels) {
      newSearchText = '';

      onSearchSplit(patchLabels);

      // Should close when paste finish
      onToggleOpen(false);

      // Tell Selector that break next actions
      ret = false;
    }

    if (onSearch && searchValue !== newSearchText) {
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
    if (!mergedOpen && !isMultiple && mode !== 'combobox') {
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

    if (searchValue) {
      // `tags` mode should move `searchValue` into values
      if (mode === 'tags') {
        // TODO: blur need submit to change value
        onSearch(searchValue, { source: 'submit' });
      } else if (mode === 'multiple') {
        // `multiple` mode only clean the search value but not trigger event
        onSearch('', {
          source: 'clear',
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

  // TODO: here has onPopupMouseEnter

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

  // ==================================================================
  // ==                            Render                            ==
  // ==================================================================

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
          searchValue,
          open: mergedOpen,
          focused: mockFocused,
          showSearch: mergedShowSearch,
        }}
      />
    );
  }

  // ============================= Select =============================
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

  // >>> Selector
  const selectorNode = (
    <SelectTrigger
      ref={triggerRef}
      disabled={disabled}
      prefixCls={prefixCls}
      visible={triggerOpen}
      popupElement={dropdownContent}
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
      empty={dropdownEmpty}
      getTriggerDOMNode={() => selectorDomRef.current}
      onPopupVisibleChange={onTriggerVisibleChange}
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
          id={mergedId}
          showSearch={mergedShowSearch}
          mode={mode}
          activeDescendantId={activeDescendantId}
          multiple={multiple}
          tagRender={tagRender}
          values={displayValues}
          open={mergedOpen}
          onToggleOpen={onToggleOpen}
          activeValue={activeValue}
          searchValue={searchValue}
          onSearch={onInternalSearch}
          onSearchSubmit={onInternalSearchSubmit}
          onSelect={onSelect}
          tokenWithEnter={tokenWithEnter}
        />
      )}
    </SelectTrigger>
  );

  // Render raw
  if (customizeRawInputElement) {
    return selectorNode;
  }

  return (
    <div
      className={mergedClassName}
      // {...domProps}
      // ref={containerRef}
      // onMouseDown={onInternalMouseDown}
      // onKeyDown={onInternalKeyDown}
      // onKeyUp={onInternalKeyUp}
      // onFocus={onContainerFocus}
      // onBlur={onContainerBlur}
    >
      {arrowNode}
    </div>
  );

  return null;
});

export default BaseSelect;
