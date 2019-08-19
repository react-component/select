import * as React from 'react';
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

  onToggleOpen: (open?: boolean) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const Selector: React.RefForwardingComponent<RefSelectorProps, SelectorProps> = (props, ref) => {
  const { prefixCls } = React.useContext(SelectContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  const { id, showSearch, open, values, multiple, onToggleOpen, onFocus, onBlur } = props;

  const [inputValue, setInputValue] = React.useState('');
  const [inputWidth, setInputWidth] = React.useState(0);

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    getInputElement: () => inputRef.current,
  }));

  // ===================== Measure =====================
  const onInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => {
      setInputValue(value);
    },
    [],
  );

  // We measure width and set to the input immediately
  React.useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [inputValue]);

  // ====================== Event ======================
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

  return (
    <div className={`${prefixCls}-selector`} onClick={onClick}>
      {/* Multiple values */}
      {multiple &&
        values.map(({ label, value }) => (
          <span key={value} className={`${prefixCls}-selection-item`}>
            {label}
          </span>
        ))}

      <span className={`${prefixCls}-selection-search`} style={{ width: inputWidth }}>
        <input
          ref={inputRef}
          className={`${prefixCls}-selection-search-input`}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={!showSearch}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-owns={`${id}_list`}
          value={inputValue}
          onChange={onInputChange}
        />

        <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
          {inputValue}
        </span>
      </span>
    </div>
  );
};

export default React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
