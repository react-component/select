import * as React from 'react';

export interface TransBtnProps {
  className: string;
  customizeIcon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  children?: React.ReactNode;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const TransBtn: React.FC<TransBtnProps> = ({ className, customizeIcon, onClick, children }) => (
  <span
    className={className}
    onMouseDown={preventDefault}
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
