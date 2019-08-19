import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { SelectContext } from './Context';
import { LabelValueType } from './interface/generator';

export interface RefSelectorProps {
  getInputElement: () => HTMLInputElement;
}

export interface SelectorProps {
  id: string;
  showSearch?: boolean;
  open: boolean;
  /** Display in the Selector value, it's not same as `value` prop */
  values: LabelValueType[];
  multiple: boolean;
  searchValue: string;

  onToggleOpen: (open?: boolean) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onSearch: (searchValue: string) => void;
}

const Selector: React.RefForwardingComponent<RefSelectorProps, SelectorProps> = (props, ref) => {
  const { prefixCls } = React.useContext(SelectContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  const {
    id,
    showSearch,
    open,
    values,
    multiple,
    searchValue,
    onToggleOpen,
    onFocus,
    onBlur,
    onSearch,
  } = props;

  const [inputWidth, setInputWidth] = React.useState(0);

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    getInputElement: () => inputRef.current,
  }));

  // ===================== Measure =====================
  const onInputKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(event => {
    const { which } = event;

    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      event.preventDefault();
    }
  }, []);

  const onInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => {
      onSearch(value);
      onToggleOpen(true);
    },
    [],
  );

  // We measure width and set to the input immediately
  React.useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [searchValue]);

  // ====================== Focus ======================
  // Should focus input if click the selector
  const onClick = ({ target }) => {
    if (target !== inputRef.current) {
      inputRef.current.focus();
    }

    /**
     * When to trigger open?
     * 1. Not open
     * 2. open but click item is not input
     */
    if (!open || target !== inputRef.current) {
      onToggleOpen();
    }
  };

  // ==================== Selection ====================
  let selectionNode: React.ReactNode;
  if (multiple) {
    selectionNode = values.map(({ label, value }) => (
      <span key={value} className={`${prefixCls}-selection-item`}>
        {label}
      </span>
    ));
  } else if (!searchValue && values.length) {
    selectionNode = <span className={`${prefixCls}-selection-item`}>{values[0].label}</span>;
  }

  return (
    <div className={`${prefixCls}-selector`} onClick={onClick}>
      {selectionNode}

      <span className={`${prefixCls}-selection-search`} style={{ width: inputWidth }}>
        <input
          ref={inputRef}
          className={`${prefixCls}-selection-search-input`}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={!showSearch}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-owns={`${id}_list`}
          value={searchValue}
          onKeyDown={onInputKeyDown}
          onChange={onInputChange}
        />

        <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
          {searchValue}
        </span>
      </span>
    </div>
  );
};

export default React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
