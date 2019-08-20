import * as React from 'react';

export interface TransBtnProps {
  className: string;
  customizeIcon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const TransBtn: React.FC<TransBtnProps> = ({ className, customizeIcon, onClick }) => (
  <span
    className={className}
    onMouseDown={preventDefault}
    style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}
    unselectable="on"
    onClick={onClick}
  >
    {customizeIcon || <i className={`${className}-icon`}>×</i>}
  </span>
);

export default TransBtn;
