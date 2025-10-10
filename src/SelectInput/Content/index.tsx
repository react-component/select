import * as React from 'react';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import { useSelectInputContext } from '../context';

export default function SelectContent() {
  const { multiple } = useSelectInputContext();

  if (multiple) {
    return <MultipleContent />;
  }

  return <SingleContent />;
}
