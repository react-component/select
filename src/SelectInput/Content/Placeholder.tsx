import * as React from 'react';
import { useSelectInputContext } from '../context';

export default function Placeholder() {
  const { prefixCls, placeholder } = useSelectInputContext();

  return <div className={`${prefixCls}-placeholder`}>{placeholder}</div>;
}
