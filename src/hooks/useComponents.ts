import * as React from 'react';
import SelectInput, { type SelectInputProps } from '../SelectInput';

export interface ComponentsConfig {
  root?: React.ComponentType<any>;
  input?: React.ComponentType<any>;
}

export interface ReturnType {
  root: React.ComponentType<SelectInputProps> | string;
  input: React.ComponentType<any> | string;
}

export default function useComponents(components?: ComponentsConfig): ReturnType {
  return React.useMemo(() => {
    const { root: RootComponent = SelectInput, input: InputComponent = 'input' } = components || {};

    return { root: RootComponent, input: InputComponent };
  }, [components]);
}
