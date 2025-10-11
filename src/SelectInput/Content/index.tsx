import * as React from 'react';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';

export interface SharedContentProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const SelectContent = React.forwardRef<HTMLInputElement>(function SelectContent(_, ref) {
  const { multiple, onInputKeyDown } = useSelectInputContext();
  const { showSearch } = useBaseProps();

  const sharedInputProps: SharedContentProps['inputProps'] = {
    onKeyDown: onInputKeyDown,
    readOnly: !showSearch,
  };

  if (multiple) {
    return <MultipleContent ref={ref} inputProps={sharedInputProps} />;
  }

  return <SingleContent ref={ref} inputProps={sharedInputProps} />;
});

export default SelectContent;
