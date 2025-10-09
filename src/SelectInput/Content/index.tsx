import * as React from 'react';
import SingleContent from './SingleContent';
import MultipleContent from './MultipleContent';
import type { DisplayValueType } from '../../interface';

export interface SelectContentProps {
  prefixCls: string;
  multiple?: boolean;
}

export interface SharedContentProps {
  prefixCls: string;
  value: DisplayValueType[];
}

export default function SelectContent(props: SelectContentProps) {
  const { prefixCls, multiple } = props;
  const sharedProps: SharedContentProps = { prefixCls };

  if (multiple) {
    return <MultipleContent {...sharedProps} />;
  }

  return <SingleContent {...sharedProps} />;
}
