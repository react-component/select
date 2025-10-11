import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';
import type { SharedContentProps } from '.';

export default React.forwardRef<HTMLInputElement, SharedContentProps>(function SingleContent(
  { inputProps },
  ref,
) {
  const { prefixCls, searchValue, displayValues, maxLength, mode } = useSelectInputContext();

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
      <Input
        ref={ref}
        {...inputProps}
        value={searchValue}
        maxLength={mode === 'combobox' ? maxLength : undefined}
      />
    </div>
  );
});
