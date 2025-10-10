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
  [key: string]: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { ...restProps } = props;
  const { prefixCls } = useSelectInputContext();

  const inputCls = `${prefixCls}-input`;

  return <input ref={ref} className={inputCls} {...restProps} />;
});

export default Input;
