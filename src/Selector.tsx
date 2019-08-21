// https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { SelectContext } from './Context';
import { LabelValueType, RawValueType } from './interface/generator';

export interface RefSelectorProps {
  getInputElement: () => HTMLInputElement;
  focus: () => void;
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
  disabled?: boolean;

  onToggleOpen: (open?: boolean) => void;
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
    disabled,
    onToggleOpen,
    onSearch,
  } = props;

  const [inputWidth, setInputWidth] = React.useState(0);

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    getInputElement: () => inputRef.current,
    focus: () => {
      inputRef.current.focus();
    },
  }));

  // ===================== Measure =====================
  const [typing, setTyping] = React.useState<boolean>(false);

  const onInputKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    event => {
      const { which } = event;

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        event.preventDefault();
      }

      if (!typing) {
        setTyping(true);
      } else if (which === KeyCode.ENTER) {
        setTyping(false);
      }
    },
    [typing],
  );

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
  };

  const onMouseDown: React.MouseEventHandler<HTMLElement> = event => {
    if (event.target !== inputRef.current) {
      event.preventDefault();
    }

    setTyping(true);
    onToggleOpen();
  };

  const onInputBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback(() => {
    setTyping(false);
  }, []);

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
    <div className={`${prefixCls}-selector`} onClick={onClick} onMouseDown={onMouseDown}>
      {selectionNode}

      <span
        className={`${prefixCls}-selection-search`}
        style={{ width: multiple ? inputWidth : null }}
      >
        <input
          ref={inputRef}
          disabled={disabled}
          autoComplete="off"
          autoFocus={autoFocus}
          className={`${prefixCls}-selection-search-input`}
          onBlur={onInputBlur}
          readOnly={!typing}
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
