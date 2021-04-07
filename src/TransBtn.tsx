import * as React from 'react';
import classNames from 'classnames';
import type { RenderNode } from './interface';

export interface TransBtnProps {
  className: string;
  customizeIcon: RenderNode;
  customizeIconProps?: any;
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
      onMouseDown={(event) => {
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
      {icon !== undefined ? (
        icon
      ) : (
        <span className={classNames(className.split(/\s+/).map((cls) => `${cls}-icon`))}>
          {children}
        </span>
      )}
    </span>
  );
};

export default TransBtn;
