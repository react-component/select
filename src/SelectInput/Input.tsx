import * as React from 'react';
import clsx from 'clsx';
import { useSelectInputContext } from './context';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useBaseProps from '../hooks/useBaseProps';

export interface InputProps {
  id?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  maxLength?: number;
  /** width always match content width */
  syncWidth?: boolean;
  /** autoComplete for input */
  autoComplete?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    onChange,
    onKeyDown,
    onBlur,
    style,
    syncWidth,
    value,
    className,
    autoComplete,
    ...restProps
  } = props;
  const { prefixCls, mode, onSearch, onSearchSubmit, onInputBlur, autoFocus, tokenWithEnter } =
    useSelectInputContext();
  const { id, classNames, styles, open, activeDescendantId, role, disabled } = useBaseProps() || {};

  const inputCls = clsx(`${prefixCls}-input`, classNames?.input, className);

  // Used to handle input method composition status
  const compositionStatusRef = React.useRef<boolean>(false);

  // Used to handle paste content, similar to original Selector implementation
  const pastedTextRef = React.useRef<string | null>(null);

  // ============================== Refs ==============================
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current);

  // ============================== Data ==============================
  // Handle input changes
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    let { value: nextVal } = event.target;

    // Handle pasted text with tokenWithEnter, similar to original Selector implementation
    if (tokenWithEnter && pastedTextRef.current && /[\r\n]/.test(pastedTextRef.current)) {
      // CRLF will be treated as a single space for input element
      const replacedText = pastedTextRef.current
        .replace(/[\r\n]+$/, '')
        .replace(/\r\n/g, ' ')
        .replace(/[\r\n]/g, ' ');
      nextVal = nextVal.replace(replacedText, pastedTextRef.current);
    }

    // Reset pasted text reference
    pastedTextRef.current = null;

    // Call onSearch callback
    if (onSearch) {
      onSearch(nextVal, true, compositionStatusRef.current);
    }

    // Call original onChange callback
    onChange?.(event);
  };

  // ============================ Keyboard ============================
  // Handle keyboard events
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { key } = event;
    const { value: nextVal } = event.currentTarget;

    // Handle Enter key submission - referencing Selector implementation
    if (key === 'Enter' && mode === 'tags' && !compositionStatusRef.current && onSearchSubmit) {
      onSearchSubmit(nextVal);
    }

    // Call original onKeyDown callback
    onKeyDown?.(event);
  };

  // Handle blur events
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    // Call onInputBlur callback
    onInputBlur?.();

    // Call original onBlur callback
    onBlur?.(event);
  };

  // Handle input method composition start
  const handleCompositionStart = () => {
    compositionStatusRef.current = true;
  };

  // Handle input method composition end
  const handleCompositionEnd: React.CompositionEventHandler<HTMLInputElement> = (event) => {
    compositionStatusRef.current = false;

    // Trigger search when input method composition ends, similar to original Selector
    if (mode !== 'combobox') {
      const { value: nextVal } = event.currentTarget;
      onSearch?.(nextVal, true, false);
    }
  };

  // Handle paste events to track pasted content
  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
    const { clipboardData } = event;
    const pastedValue = clipboardData?.getData('text');
    pastedTextRef.current = pastedValue || '';
  };

  // ============================= Width ==============================
  const [widthCssVar, setWidthCssVar] = React.useState<number | undefined>(undefined);

  // When syncWidth is enabled, adjust input width based on content
  useLayoutEffect(() => {
    const input = inputRef.current;

    if (syncWidth && input) {
      input.style.width = '0px';
      const scrollWidth = input.scrollWidth;
      setWidthCssVar(scrollWidth);

      // Reset input style
      input.style.width = '';
    }
  }, [syncWidth, value]);

  // ============================= Render =============================
  return (
    <input
      id={id}
      type={mode === 'combobox' ? 'text' : 'search'}
      {...restProps}
      ref={inputRef}
      style={
        {
          ...styles?.input,
          ...style,
          '--select-input-width': widthCssVar,
        } as React.CSSProperties
      }
      autoFocus={autoFocus}
      autoComplete={autoComplete || 'off'}
      className={inputCls}
      disabled={disabled}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      // Accessibility attributes
      role={role || 'combobox'}
      aria-expanded={open || false}
      aria-haspopup="listbox"
      aria-owns={`${id}_list`}
      aria-autocomplete="list"
      aria-controls={`${id}_list`}
      aria-activedescendant={open ? activeDescendantId : undefined}
      // onMouseDown={onMouseDown}
    />
  );
});

export default Input;
