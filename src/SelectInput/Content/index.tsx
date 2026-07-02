import * as React from 'react';
import { pickAttrs } from '@rc-component/util';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';
import useBaseProps from '../../hooks/useBaseProps';

export interface SharedContentProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

function SelectContent(_props: unknown, ref: React.ForwardedRef<HTMLInputElement>) {
  const { multiple, onInputKeyDown, tabIndex } = useSelectInputContext();
  const baseProps = useBaseProps();
  const { showSearch } = baseProps;

  const ariaProps = pickAttrs(baseProps, { aria: true });

  const sharedInputProps: SharedContentProps['inputProps'] = {
    ...ariaProps,
    onKeyDown: onInputKeyDown,
    readOnly: !showSearch,
    tabIndex,
  };

  if (multiple) {
    return <MultipleContent ref={ref} inputProps={sharedInputProps} />;
  }

  return <SingleContent ref={ref} inputProps={sharedInputProps} />;
}

export default React.forwardRef<HTMLInputElement>(SelectContent);
