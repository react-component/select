import * as React from 'react';
import { useSelectInputContext } from '../context';

export interface PlaceholderProps {
  show: boolean;
}

export default function Placeholder(props: PlaceholderProps) {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();
  const { show } = props;

  if (displayValues.length) {
    return null;
  }

  return (
    <div
      className={`${prefixCls}-placeholder`}
      style={{
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      {placeholder}
    </div>
  );
}
