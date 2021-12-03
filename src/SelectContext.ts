import * as React from 'react';
import type { OnActiveValue } from './Select';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: any[];
  flattenOptions: any[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
}

const SelectContext = React.createContext<SelectContextProps>(null);

export default SelectContext;
