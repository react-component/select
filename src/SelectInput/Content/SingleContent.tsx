import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';

export default React.forwardRef<HTMLInputElement, unknown>(function SingleContent(_, ref) {
  const { prefixCls, searchValue, displayValues } = useSelectInputContext();

  const displayValue = displayValues[0];

  return (
    <div className={`${prefixCls}-content`}>
      {displayValue ? (
        <div
          className={`${prefixCls}-content-value`}
          style={{
            visibility: searchValue ? 'hidden' : 'visible',
          }}
        >
          {displayValue.label}
        </div>
      ) : (
        <Placeholder />
      )}
      <Input ref={ref} value={searchValue} />
    </div>
  );
});
