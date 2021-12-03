import * as React from 'react';
import type { RenderNode } from './BaseSelect';
import type { OnActiveValue, OnInternalSelect } from './Select';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: any[];
  flattenOptions: any[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
}

const SelectContext = React.createContext<SelectContextProps>(null);

export default SelectContext;
