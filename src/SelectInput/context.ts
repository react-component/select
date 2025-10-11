import * as React from 'react';
import type { SelectInputProps } from '.';

export type ContentContextProps = SelectInputProps;

const SelectInputContext = React.createContext<ContentContextProps>(null!);

export function useSelectInputContext() {
  return React.useContext(SelectInputContext);
}

export default SelectInputContext;
