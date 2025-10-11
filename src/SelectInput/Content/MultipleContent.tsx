import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import type { SharedContentProps } from '.';

// This is just a placeholder, do not code any logic here

export default React.forwardRef<HTMLInputElement, SharedContentProps>(function MultipleContent(
  { inputProps },
  ref,
) {
  const { prefixCls, displayValues: value, maxLength, mode } = useSelectInputContext();

  // For multiple mode, we show all values as a comma-separated string
  const displayValue = value
    .map((v) => v.label?.toString() || v.value?.toString() || '')
    .join(', ');

  return (
    <div className={`${prefixCls}-content`}>
      <Input
        ref={ref}
        {...inputProps}
        value={displayValue}
        maxLength={mode === 'combobox' ? maxLength : undefined}
      />
    </div>
  );
});
