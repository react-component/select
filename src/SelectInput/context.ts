import type { DisplayValueType } from '../interface';
import * as React from 'react';

// TODO: 把其他直接传导下列 props 的子组件全部都改成 useSelectInputContext 取值
export interface ContentContextProps {
  prefixCls: string;
  multiple: boolean;
  displayValues: DisplayValueType[];
}

const SelectInputContext = React.createContext<ContentContextProps>(null!);

export function useSelectInputContext() {
  return React.useContext(SelectInputContext);
}

export default SelectInputContext;
