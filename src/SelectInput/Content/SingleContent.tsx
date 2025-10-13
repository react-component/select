import * as React from 'react';
import clsx from 'clsx';
import Input from '../Input';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';
import Placeholder from './Placeholder';
import type { SharedContentProps } from '.';
import SelectContext from '../../SelectContext';

export default React.forwardRef<HTMLInputElement, SharedContentProps>(function SingleContent(
  { inputProps },
  ref,
) {
  const { prefixCls, searchValue, activeValue, displayValues, maxLength, mode } =
    useSelectInputContext();
  const { triggerOpen } = useBaseProps();
  const selectContext = React.useContext(SelectContext);

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const displayValue = displayValues[0];

  // Implement the same logic as the old SingleSelector
  const mergedSearchValue = React.useMemo(() => {
    if (combobox && activeValue && !inputChanged && triggerOpen) {
      return activeValue;
    }

    return searchValue || '';
  }, [combobox, activeValue, inputChanged, triggerOpen, searchValue]);

  // Extract option props, excluding label and value, and handle className/style merging
  const optionProps = React.useMemo(() => {
    let restProps: React.HTMLAttributes<HTMLDivElement> = {
      className: `${prefixCls}-content-value`,
      style: {
        visibility: mergedSearchValue ? 'hidden' : 'visible',
      },
    };

    if (displayValue && selectContext?.flattenOptions) {
      const option = selectContext.flattenOptions.find((opt) => opt.value === displayValue.value);
      if (option?.data) {
        const { label, value, className, style, ...rest } = option.data;

        restProps = {
          ...restProps,
          ...rest,
          className: clsx(restProps.className, className),
          style: { ...restProps.style, ...style },
        };
      }
    }

    return restProps;
  }, [displayValue, selectContext?.flattenOptions, prefixCls, mergedSearchValue]);

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  return (
    <div className={`${prefixCls}-content`}>
      {displayValue ? (
        <div {...optionProps}>{displayValue.label}</div>
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
