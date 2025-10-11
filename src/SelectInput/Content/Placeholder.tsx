import * as React from 'react';
import { useSelectInputContext } from '../context';

export interface PlaceholderProps {
  hasSearchValue?: boolean;
}

export default function Placeholder(props: PlaceholderProps) {
  const { prefixCls, placeholder, displayValues } = useSelectInputContext();

  const { searchValue } = useSelectInputContext();

  const { hasSearchValue = !!searchValue } = props;

  if (displayValues.length) {
    return null;
  }

  return (
    <div
      className={`${prefixCls}-placeholder`}
      style={{
        visibility: hasSearchValue ? 'hidden' : 'visible',
      }}
    >
      {placeholder}
    </div>
  );
}
