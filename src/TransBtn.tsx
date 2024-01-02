import * as React from 'react';
import classNames from 'classnames';
import type { RenderNode } from './BaseSelect';

export interface TransBtnProps {
  className: string;
  customizeIcon: RenderNode;
  customizeIconProps?: any;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  children?: React.ReactNode;
}

const TransBtn: React.FC<TransBtnProps> = (props) => {
  const { className, customizeIcon, customizeIconProps, children, onMouseDown, onClick } = props;

  const icon =
    typeof customizeIcon === 'function' ? customizeIcon(customizeIconProps) : customizeIcon;

  return (
    <span
      className={className}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
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
