import * as React from 'react';
import { useComposeRef } from 'rc-util/lib/ref';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import Selector, { RefSelectorProps } from './Selector';
import useId from './hooks/useId';

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

  // Mode
  mode?: Mode;

  // Disabled
  disabled?: boolean;

  // Open
  open: boolean;
  onOpen: (open: boolean) => void;

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

  // Search
  searchValue: string;
  /** Trigger onSearch, return false to prevent trigger open event */
  onSearch: (searchValue: string, fromTyping: boolean, isCompositing: boolean) => boolean;
  onSearchSubmit?: (searchText: string) => void;
  /** Only used for tag mode. Check if separator has \r\n */
  tokenWithEnter?: boolean;

  // Value
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;

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
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: any) => {
  const {
    id,
    prefixCls,
    showSearch,
    multiple,
    tagRender,
    displayValues,
    direction,

    // Mode
    mode,

    // Disabled
    disabled,

    // Customize Input
    getInputElement,
    getRawInputElement,

    // Open
    open,
    onOpen,

    // Active
    activeValue,
    activeDescendantId,

    // Search
    tokenWithEnter,
    searchValue,
    onSearch,
    onSearchSubmit,

    // Value
    onSelect,

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
  } = props;

  // ============================== MISC ==============================
  const mergedId = useId(id);

  // ============================== Refs ==============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectorDomRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<RefTriggerProps>(null);
  const selectorRef = React.useRef<RefSelectorProps>(null);
  // const listRef = React.useRef<RefOptionListProps>(null);

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
  const onToggleOpen = (newOpen?: boolean) => {
    const nextOpen = newOpen !== undefined ? newOpen : !open;

    if (open !== nextOpen && !disabled) {
      onOpen(nextOpen);
    }
  };

  // ============================ Dropdown ============================
  const [containerWidth, setContainerWidth] = React.useState(null);

  // TODO: here has onPopupMouseEnter

  useLayoutEffect(() => {
    if (open) {
      const newWidth = Math.ceil(containerRef.current?.offsetWidth);
      if (containerWidth !== newWidth && !Number.isNaN(newWidth)) {
        setContainerWidth(newWidth);
      }
    }
  }, [open]);

  // Used for raw custom input trigger
  let onTriggerVisibleChange: null | ((newOpen: boolean) => void);
  if (customizeRawInputElement) {
    onTriggerVisibleChange = (newOpen: boolean) => {
      onToggleOpen(newOpen);
    };
  }

  // ============================= Render =============================
  const selectorNode = (
    <SelectTrigger
      ref={triggerRef}
      disabled={disabled}
      prefixCls={prefixCls}
      visible={open}
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
          showSearch={showSearch}
          mode={mode}
          activeDescendantId={activeDescendantId}
          multiple={multiple}
          tagRender={tagRender}
          values={displayValues}
          open={open}
          onToggleOpen={onToggleOpen}
          activeValue={activeValue}
          searchValue={searchValue}
          onSearch={onSearch}
          onSearchSubmit={onSearchSubmit}
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

  // return (
  //   <div
  //     className={mergedClassName}
  //     {...domProps}
  //     ref={containerRef}
  //     onMouseDown={onInternalMouseDown}
  //     onKeyDown={onInternalKeyDown}
  //     onKeyUp={onInternalKeyUp}
  //     onFocus={onContainerFocus}
  //     onBlur={onContainerBlur}
  //   >
  //     {mockFocused && !mergedOpen && (
  //       <span
  //         style={{
  //           width: 0,
  //           height: 0,
  //           display: 'flex',
  //           overflow: 'hidden',
  //           opacity: 0,
  //         }}
  //         aria-live="polite"
  //       >
  //         {/* Merge into one string to make screen reader work as expect */}
  //         {`${mergedRawValue.join(', ')}`}
  //       </span>
  //     )}
  //     {selectorNode}

  //     {arrowNode}
  //     {clearNode}
  //   </div>
  // );

  return null;
});

export default BaseSelect;
