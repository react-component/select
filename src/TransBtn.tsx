import * as React from 'react';

export interface TransBtnProps {
  className: string;
  customizeIcon: React.ReactNode;
  customizeIconProps?: { isSelected: boolean };
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  children?: React.ReactNode;
}

const TransBtn: React.FC<TransBtnProps> = ({
  className,
  customizeIcon,
  customizeIconProps,
  onMouseDown,
  onClick,
  children,
}) => {
  let icon: React.ReactNode;

  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = customizeIcon;
  }

  return (
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
      {icon || <span className={`${className}-icon`}>{children}</span>}
    </span>
  );
};

export default TransBtn;
