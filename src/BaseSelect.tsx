import * as React from 'react';
import SelectTrigger from './SelectTrigger';
import Selector from './Selector';
import useId from './hooks/useId';

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

  // Open
  open: boolean;
  onOpen: (open: boolean) => void;

  // Active
  // TODO: only combo box support this
  backfill?: boolean;
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
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: any) => {
  const {
    id,
    prefixCls,
    showSearch,
    multiple,
    tagRender,
    displayValues,

    // Open
    open,
    onOpen,

    // Active
    backfill,
    activeValue,
    activeDescendantId,

    // Search
    tokenWithEnter,
    searchValue,
    onSearch,
    onSearchSubmit,

    // Value
    onSelect,
  } = props;

  // ============================== MISC ==============================
  const mergedId = useId(id);

  // ========================== Custom Input ==========================
  const customizeRawInputElement = null;

  // ============================= Render =============================
  const selectorNode = (
    <SelectTrigger
    // ref={triggerRef}
    // disabled={disabled}
    // prefixCls={prefixCls}
    // visible={triggerOpen}
    // popupElement={popupNode}
    // containerWidth={containerWidth}
    // animation={animation}
    // transitionName={transitionName}
    // dropdownStyle={dropdownStyle}
    // dropdownClassName={dropdownClassName}
    // direction={direction}
    // dropdownMatchSelectWidth={dropdownMatchSelectWidth}
    // dropdownRender={dropdownRender}
    // dropdownAlign={dropdownAlign}
    // placement={placement}
    // getPopupContainer={getPopupContainer}
    // empty={!mergedOptions.length}
    // getTriggerDOMNode={() => selectorDomRef.current}
    // onPopupVisibleChange={onTriggerVisibleChange}
    >
      {customizeRawInputElement ? null : ( // }) //   ref: composeRef(selectorDomRef, customizeRawInputElement.props.ref), // React.cloneElement(customizeRawInputElement, {
        <Selector
          {...props}
          // domRef={selectorDomRef}
          prefixCls={prefixCls}
          // inputElement={customizeInputElement}
          // ref={selectorRef}
          id={mergedId}
          showSearch={showSearch}
          // mode={mode}
          activeDescendantId={activeDescendantId}
          multiple={multiple}
          tagRender={tagRender}
          values={displayValues}
          open={open}
          onToggleOpen={onOpen}
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
  // if (customizeRawInputElement) {
  //   return selectorNode;
  // }

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
