import type { DisplayValueType } from '../interface';
import * as React from 'react';

export interface ContentContextProps {
  prefixCls: string;
  multiple: boolean;
  displayValues: DisplayValueType[];
  placeholder?: React.ReactNode;
  searchValue?: string;
}

const SelectInputContext = React.createContext<ContentContextProps>(null!);

export function useSelectInputContext() {
  return React.useContext(SelectInputContext);
}

export default SelectInputContext;
