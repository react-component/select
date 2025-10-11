import type { DisplayValueType, Mode } from '../interface';
import * as React from 'react';

export interface ContentContextProps {
  prefixCls: string;
  multiple: boolean;
  displayValues: DisplayValueType[];
  placeholder: React.ReactNode;
  searchValue: string;
  maxLength?: number;
  autoFocus?: boolean;
  mode: Mode;
  onSearch: (searchText: string, fromTyping: boolean, isCompositing: boolean) => void;
  onSearchSubmit: (searchText: string) => void;
  onInputBlur: () => void;
}

const SelectInputContext = React.createContext<ContentContextProps>(null!);

export function useSelectInputContext() {
  return React.useContext(SelectInputContext);
}

export default SelectInputContext;
