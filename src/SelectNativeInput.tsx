import classNames from 'classnames';
import React from 'react';

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  overflow: 'hidden',
  width: 1,
  height: 1,
  border: 0,
  margin: -1,
  padding: 0,
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

interface SelectNativeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixCls?: string;
}

export default React.forwardRef<HTMLInputElement, SelectNativeInputProps>(
  function SelectNativeInput(props, ref) {
    const { prefixCls, className, style, ...rest } = props;

    return (
      <input
        ref={ref}
        className={classNames(`${prefixCls}-native-input`, className)}
        style={{ ...visuallyHidden, ...style }}
        {...rest}
      />
    );
  },
);
