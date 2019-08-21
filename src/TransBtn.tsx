import * as React from 'react';

export interface TransBtnProps {
  className: string;
  customizeIcon: React.ReactNode;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  children?: React.ReactNode;
}

const TransBtn: React.FC<TransBtnProps> = ({
  className,
  customizeIcon,
  onMouseDown,
  onClick,
  children,
}) => (
  <span
    className={className}
    onMouseDown={event => {
      event.preventDefault();
      if (onMouseDown) {
        onMouseDown(event);
      }
    }}
    style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}
    unselectable="on"
    onClick={onClick}
    aria-hidden
  >
    {customizeIcon || <span className={`${className}-icon`}>{children}</span>}
  </span>
);

export default TransBtn;
