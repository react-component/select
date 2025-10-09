import * as React from 'react';

export interface InputProps {
  prefixCls: string;
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
  [key: string]: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { prefixCls, ...restProps } = props;

  const inputCls = `${prefixCls}-input`;

  return <input ref={ref} className={inputCls} {...restProps} />;
});

export default Input;
