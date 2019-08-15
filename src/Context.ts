import * as React from 'react';

export interface SelectContextProps {
  prefixCls: string;
}

export const SelectContext = React.createContext<SelectContextProps>(null);
