import * as React from 'react';
import SelectInput, { type SelectInputProps } from '../SelectInput';

export interface ComponentsConfig {
  root?: React.ComponentType<any> | string;
  input?:
    | React.ComponentType<
        | React.TextareaHTMLAttributes<HTMLTextAreaElement>
        | React.InputHTMLAttributes<HTMLInputElement>
      >
    | string;
}

export interface FilledComponentsConfig {
  root: React.ComponentType<SelectInputProps>;
  input: React.ComponentType<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.InputHTMLAttributes<HTMLInputElement>
  >;
}

export default function useComponents(components?: ComponentsConfig) {
  return React.useMemo(() => {
    const { root: RootComponent = SelectInput, input: InputComponent = 'input' } = components || {};

    return { root: RootComponent, input: InputComponent } as FilledComponentsConfig;
  }, [components]);
}
