import * as React from 'react';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';

const SelectContent = React.forwardRef<HTMLInputElement>(function SelectContent(_, ref) {
  const { multiple } = useSelectInputContext();

  if (multiple) {
    return <MultipleContent ref={ref} />;
  }

  return <SingleContent ref={ref} />;
});

export default SelectContent;
