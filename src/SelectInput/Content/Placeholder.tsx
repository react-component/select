import * as React from 'react';
import { clsx } from 'clsx';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';

export interface PlaceholderProps {
  show?: boolean;
}

export default function Placeholder(props: PlaceholderProps) {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();
  const { classNames, styles } = useBaseProps();
  const { show = true } = props;

  if (displayValues.length) {
    return null;
  }

  return (
    <div
      className={clsx(`${prefixCls}-placeholder`, classNames?.placeholder)}
      style={{
        visibility: show ? 'visible' : 'hidden',
        ...styles?.placeholder,
      }}
    >
      {placeholder}
    </div>
  );
}
