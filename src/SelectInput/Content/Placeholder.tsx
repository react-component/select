import * as React from 'react';
import { useSelectInputContext } from '../context';

export default function Placeholder() {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();

  const { searchValue } = useSelectInputContext();

  if (displayValues.length || searchValue) {
    return null;
  }

  return <div className={`${prefixCls}-placeholder`}>{placeholder}</div>;
}
