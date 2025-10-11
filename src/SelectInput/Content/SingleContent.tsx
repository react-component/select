import * as React from 'react';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import Placeholder from './Placeholder';
import type { SharedContentProps } from '.';

export default React.forwardRef<HTMLInputElement, SharedContentProps>(function SingleContent(
  { inputProps },
  ref,
) {
  const { prefixCls, searchValue, activeValue, displayValues, maxLength, mode, onSearch } =
    useSelectInputContext();

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const displayValue = displayValues[0];

  // Implement the same logic as the old SingleSelector
  let mergedSearchValue: string = searchValue || '';
  if (combobox && activeValue && !inputChanged) {
    mergedSearchValue = activeValue;
  }

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  return (
    <div className={`${prefixCls}-content`}>
      {displayValue ? (
        <div
          className={`${prefixCls}-content-value`}
          style={{
            visibility: mergedSearchValue ? 'hidden' : 'visible',
          }}
        >
          {displayValue.label}
        </div>
      ) : (
        <Placeholder hasSearchValue={!!mergedSearchValue} />
      )}
      <Input
        ref={ref}
        {...inputProps}
        value={mergedSearchValue}
        maxLength={mode === 'combobox' ? maxLength : undefined}
        onChange={(e) => {
          setInputChanged(true);
          inputProps.onChange?.(e);
        }}
      />
    </div>
  );
});
