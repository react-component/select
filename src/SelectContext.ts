import * as React from 'react';
import type { RawValueType, RenderNode } from './BaseSelect';
import type {
  BaseOptionType,
  FieldNames,
  OnActiveValue,
  OnInternalSelect,
  SelectProps,
} from './Select';
import type { FlattenOptionData } from './interface';

// Use any here since we do not get the type during compilation
export interface SelectContextProps {
  options: BaseOptionType[];
  optionRender?: SelectProps['optionRender'];
  flattenOptions: FlattenOptionData<BaseOptionType>[];
  onActiveValue: OnActiveValue;
  defaultActiveFirstOption?: boolean;
  onSelect: OnInternalSelect;
  menuItemSelectedIcon?: RenderNode;
  rawValues: Set<RawValueType>;
  fieldNames?: FieldNames;
  virtual?: boolean;
  direction?: 'ltr' | 'rtl';
  listHeight?: number;
  listItemHeight?: number;
  childrenAsData?: boolean;
  maxCount?: number;
}

const SelectContext = React.createContext<SelectContextProps>(null);

export default SelectContext;
