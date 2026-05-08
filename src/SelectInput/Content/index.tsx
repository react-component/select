import * as React from 'react';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';

export interface SharedContentProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const SelectContent = React.forwardRef<HTMLInputElement>(function SelectContent(_, ref) {
  const {
    multiple,
    onInputKeyDown,
    tabIndex,
    inputProps: userInputProps,
  } = useSelectInputContext();
  const baseProps = useBaseProps();
  const { showSearch } = baseProps;

  const ariaProps = pickAttrs(baseProps, { aria: true });

  const sharedInputProps: SharedContentProps['inputProps'] = {
    ...ariaProps,
    ...userInputProps,
    onKeyDown: onInputKeyDown,
    readOnly: !showSearch,
    tabIndex,
  };

  if (multiple) {
    return <MultipleContent ref={ref} inputProps={sharedInputProps} />;
  }

  return <SingleContent ref={ref} inputProps={sharedInputProps} />;
});

export default SelectContent;
