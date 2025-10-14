import * as React from 'react';
import type { SelectInputRef, SelectInputProps } from '../SelectInput';

export interface ComponentsConfig {
  root?: React.ComponentType<any> | string | React.ReactElement;
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
    const { root: RootComponent, input: InputComponent } = components || {};

    return { root: RootComponent, input: InputComponent } as FilledComponentsConfig;
  }, [components]);
}
