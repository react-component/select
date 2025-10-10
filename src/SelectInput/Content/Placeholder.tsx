import * as React from 'react';
import { useSelectInputContext } from '../context';

export default function Placeholder() {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();

  if (displayValues.length) {
    return null;
  }

  return <div className={`${prefixCls}-placeholder`}>{placeholder}</div>;
}
