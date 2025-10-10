import * as React from 'react';
import { useSelectInputContext } from '../context';

export default function Placeholder() {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();

  const { searchValue } = useSelectInputContext();

  if (displayValues.length) {
    return null;
  }

  return (
    <div
      className={`${prefixCls}-placeholder`}
      style={{
        visibility: searchValue ? 'hidden' : 'visible',
      }}
    >
      {placeholder}
    </div>
  );
}
