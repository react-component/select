// https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { SelectContext } from './Context';
import { LabelValueType, RawValueType } from './interface/generator';

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

  autoFocus?: boolean;
  accessibilityIndex: number;

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
    autoFocus,
    showSearch,
    open,
    values,
    multiple,
    searchValue,
    accessibilityIndex,
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
  const [typing, setTyping] = React.useState<boolean>(false);

  const onInputKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(event => {
    const { which } = event;

    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      event.preventDefault();
    }

    if (which === KeyCode.ENTER) {
      setTyping(false);
    }
  }, []);

  const onInputChange = ({ target: { value } }) => {
    onSearch(value);
    onToggleOpen(true);
  };

  // We measure width and set to the input immediately
  React.useLayoutEffect(() => {
    if (multiple) {
      setInputWidth(measureRef.current.scrollWidth);
    }
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

  const onInternalFocus: React.FocusEventHandler<HTMLInputElement> = (...args) => {
    setTyping(true);
    onFocus(...args);
  };
  const onInternalBlur: React.FocusEventHandler<HTMLInputElement> = (...args) => {
    setTyping(false);
    onBlur(...args);
  };

  // ==================== Selection ====================
  let selectionNode: React.ReactNode;
  if (multiple) {
    selectionNode = values.map(({ label, value }) => (
      <span key={value} className={`${prefixCls}-selection-item`}>
        {label}
      </span>
    ));
  } else if (!searchValue) {
    selectionNode = (
      <span
        className={`${prefixCls}-selection-item`}
        style={{ opacity: typing || open ? 0.4 : null }}
      >
        {values[0].label}
      </span>
    );
  }

  return (
    <div className={`${prefixCls}-selector`} onClick={onClick}>
      {selectionNode}

      <span
        className={`${prefixCls}-selection-search`}
        style={{ width: multiple ? inputWidth : null }}
      >
        <input
          ref={inputRef}
          autoComplete="off"
          autoFocus={autoFocus}
          className={`${prefixCls}-selection-search-input`}
          onFocus={onInternalFocus}
          onBlur={onInternalBlur}
          readOnly={!showSearch}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-owns={`${id}_list`}
          aria-autocomplete="list"
          aria-controls={`${id}_list`}
          aria-activedescendant={`${id}_list_${accessibilityIndex}`}
          value={searchValue}
          onKeyDown={onInputKeyDown}
          onChange={onInputChange}
        />

        {multiple && (
          <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
            {searchValue}
          </span>
        )}
      </span>
    </div>
  );
};

export default React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
