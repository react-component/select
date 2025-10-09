import * as React from 'react';
import SelectInput, { type SelectInputProps } from '../SelectInput';

export interface ComponentsConfig {
  root?: React.ComponentType<any>;
}

export interface ReturnType {
  root: React.ComponentType<SelectInputProps>;
}

export default function useComponents(components?: ComponentsConfig): ReturnType {
  return React.useMemo(() => {
    const { root: RootComponent = SelectInput } = components || {};

    return { root: RootComponent };
  }, [components]);
}
