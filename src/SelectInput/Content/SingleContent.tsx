import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';

export default function SingleContent() {
  const { prefixCls, searchValue } = useSelectInputContext();

  return (
    <div className={`${prefixCls}-content`}>
      <Input value={searchValue} />
      <Placeholder />
    </div>
  );
}
