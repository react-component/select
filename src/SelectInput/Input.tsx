import * as React from 'react';
import clsx from 'clsx';
import { useSelectInputContext } from './context';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useBaseProps from '../hooks/useBaseProps';

export interface InputProps {
  disabled?: boolean;
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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { onChange, onKeyDown, onBlur, style, syncWidth, value, className, ...restProps } = props;
  const { prefixCls, mode, onSearch, onSearchSubmit, onInputBlur, autoFocus } =
    useSelectInputContext();
  const { classNames, styles } = useBaseProps() || {};

  const inputCls = clsx(`${prefixCls}-input`, classNames?.input, className);

  // Used to handle input method composition status
  const compositionStatusRef = React.useRef<boolean>(false);

  // ============================== Refs ==============================
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current);

  // ============================== Data ==============================
  // Handle input changes
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value: nextVal } = event.target;

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

    // Trigger search when input method composition ends
    const { value: nextVal } = event.currentTarget;
    onSearch?.(nextVal, true, false);
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
      className={inputCls}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      // onMouseDown={onMouseDown}
    />
  );
});

export default Input;
