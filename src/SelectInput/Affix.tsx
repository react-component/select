import * as React from 'react';

export interface AffixProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

// Affix is a simple wrapper which should not read context or logical props
export default function Affix(props: AffixProps) {
  const { children, ...restProps } = props;

  if (!children) {
    return null;
  }

  return <div {...restProps}>{children}</div>;
}
