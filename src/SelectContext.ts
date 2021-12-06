import * as React from 'react';
import type { RawValueType, RenderNode } from './BaseSelect';
import type { FieldNames, OnActiveValue, OnInternalSelect } from './Select';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: any[];
  flattenOptions: any[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
  rawValues: Set<RawValueType>;
  fieldNames?: FieldNames;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
}

const SelectContext = React.createContext<SelectContextProps>(null);

export default SelectContext;
