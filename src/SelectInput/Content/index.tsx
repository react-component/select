import * as React from 'react';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';

export interface SharedContentProps {
  inputProps: React.HTMLAttributes<HTMLInputElement>;
}

const SelectContent = React.forwardRef<HTMLInputElement>(function SelectContent(_, ref) {
  const { multiple, onInputKeyDown } = useSelectInputContext();

  const sharedInputProps: SharedContentProps['inputProps'] = {
    onKeyDown: onInputKeyDown,
  };

  if (multiple) {
    return <MultipleContent ref={ref} inputProps={sharedInputProps} />;
  }

  return <SingleContent ref={ref} inputProps={sharedInputProps} />;
});

export default SelectContent;
