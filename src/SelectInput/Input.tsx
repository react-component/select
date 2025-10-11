import * as React from 'react';
import { useSelectInputContext } from './context';

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
  [key: string]: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { onChange, onKeyDown, onBlur, ...restProps } = props;
  const { prefixCls, mode, onSearch, onSearchSubmit, onInputBlur, autoFocus } =
    useSelectInputContext();

  const inputCls = `${prefixCls}-input`;

  // Used to handle input method composition status
  const compositionStatusRef = React.useRef<boolean>(false);

  // Handle input changes
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;

    // Call onSearch callback
    if (onSearch) {
      onSearch(value, true, compositionStatusRef.current);
    }

    // Call original onChange callback
    onChange?.(event);
  };

  // Handle keyboard events
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { key } = event;
    const { value } = event.currentTarget;

    // Handle Enter key submission - referencing Selector implementation
    if (key === 'Enter' && mode === 'tags' && !compositionStatusRef.current && onSearchSubmit) {
      onSearchSubmit(value);
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
    const { value } = event.currentTarget;
    onSearch?.(value, true, false);
  };

  // ============================= Mouse ==============================
  // const onMouseDown: React.MouseEventHandler<HTMLElement> = (event) => {
  //   // const inputMouseDown = getInputMouseDown();
  //   // // when mode is combobox and it is disabled, don't prevent default behavior
  //   // // https://github.com/ant-design/ant-design/issues/37320
  //   // // https://github.com/ant-design/ant-design/issues/48281
  //   // if (
  //   //   event.target !== inputRef.current &&
  //   //   !inputMouseDown &&
  //   //   !(mode === 'combobox' && disabled)
  //   // ) {
  //   //   event.preventDefault();
  //   // }
  //   // if ((mode !== 'combobox' && (!showSearch || !inputMouseDown)) || !open) {
  //   //   if (open && autoClearSearchValue !== false) {
  //   //     onSearch('', true, false);
  //   //   }
  //   //   onToggleOpen();
  //   // }
  // };

  // ============================= Render =============================
  return (
    <input
      {...restProps}
      ref={ref}
      autoFocus={autoFocus}
      className={inputCls}
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
