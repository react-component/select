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
  const { onChange, onKeyDown, onBlur, ...restProps } = props;
  const { prefixCls, mode, open, onSearch, onSearchSubmit, onInputBlur } = useSelectInputContext();

  const inputCls = `${prefixCls}-input`;

  // 用于处理输入法组合状态
  const compositionStatusRef = React.useRef<boolean>(false);

  // 处理输入变化
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;

    // 调用 onSearch 回调
    if (onSearch) {
      onSearch(value, true, compositionStatusRef.current);
    }

    // 调用原始的 onChange 回调
    onChange?.(event);
  };

  // 处理键盘事件
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { key } = event;
    const { value } = event.currentTarget;

    // 处理 Enter 键提交 - 参考 Selector 的实现
    if (
      key === 'Enter' &&
      mode === 'tags' &&
      !compositionStatusRef.current &&
      !open &&
      onSearchSubmit
    ) {
      onSearchSubmit(value);
    }

    // 调用原始的 onKeyDown 回调
    onKeyDown?.(event);
  };

  // 处理失焦事件
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    // 调用 onInputBlur 回调
    onInputBlur?.();

    // 调用原始的 onBlur 回调
    onBlur?.(event);
  };

  // 处理输入法组合开始
  const handleCompositionStart = () => {
    compositionStatusRef.current = true;
  };

  // 处理输入法组合结束
  const handleCompositionEnd: React.CompositionEventHandler<HTMLInputElement> = (event) => {
    compositionStatusRef.current = false;

    // 输入法组合结束时触发搜索
    const { value } = event.currentTarget;
    onSearch?.(value, true, false);
  };

  return (
    <input
      ref={ref}
      className={inputCls}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      {...restProps}
    />
  );
});

export default Input;
