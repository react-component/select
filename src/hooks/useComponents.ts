import * as React from 'react';
import SelectInput, { type SelectInputRef, type SelectInputProps } from '../SelectInput';

export interface ComponentsConfig {
  root?: React.ComponentType<any> | string;
  input?: React.ComponentType<any> | string;
}

export interface FilledComponentsConfig {
  root: React.ForwardRefExoticComponent<SelectInputProps & React.RefAttributes<SelectInputRef>>;
  input: React.ForwardRefExoticComponent<
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
    | (React.InputHTMLAttributes<HTMLInputElement> &
        React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>)
  >;
}

export default function useComponents(components?: ComponentsConfig) {
  return React.useMemo(() => {
    const { root: RootComponent = SelectInput, input: InputComponent = 'input' } = components || {};

    return { root: RootComponent, input: InputComponent } as FilledComponentsConfig;
  }, [components]);
}
