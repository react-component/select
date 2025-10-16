import * as React from 'react';
import type { SelectInputRef, SelectInputProps } from '../SelectInput';
import type { BaseSelectProps } from '../BaseSelect';

export interface ComponentsConfig {
  root?: React.ComponentType<any> | string | React.ReactElement;
  input?: React.ComponentType<any> | string | React.ReactElement;
}

export interface FilledComponentsConfig {
  root: React.ForwardRefExoticComponent<SelectInputProps & React.RefAttributes<SelectInputRef>>;
  input: React.ForwardRefExoticComponent<
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
    | (React.InputHTMLAttributes<HTMLInputElement> &
        React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>)
  >;
}

export default function useComponents(
  components?: ComponentsConfig,
  getInputElement?: BaseSelectProps['getInputElement'],
  getRawInputElement?: BaseSelectProps['getRawInputElement'],
): ComponentsConfig {
  return React.useMemo(() => {
    let { root, input } = components || {};

    // root: getRawInputElement
    if (getRawInputElement) {
      root = getRawInputElement();
    }

    // input: getInputElement
    if (getInputElement) {
      input = getInputElement();
    }

    return {
      root,
      input,
    };
  }, [components, getInputElement, getRawInputElement]);
}
