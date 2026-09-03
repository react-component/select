import type { DisplayValueType, Mode } from '../interface';
import type React from 'react';
import { isReactRenderable } from '@rc-component/util';
import { useMemo } from 'react';

export interface AllowClearConfig {
  allowClear: boolean;
  clearIcon: React.ReactNode;
  label: string;
}

export const useAllowClear = (
  prefixCls: string,
  displayValues: DisplayValueType[],
  allowClear?: boolean | { clearIcon?: React.ReactNode; label?: string },
  clearIcon?: React.ReactNode,
  disabled: boolean = false,
  mergedSearchValue?: string,
  mode?: Mode,
): AllowClearConfig => {
  // Convert boolean to object first
  const allowClearConfig = useMemo<Partial<AllowClearConfig>>(() => {
    if (typeof allowClear === 'boolean') {
      return { allowClear };
    }
    if (allowClear && typeof allowClear === 'object') {
      return allowClear;
    }
    return { allowClear: false };
  }, [allowClear]);

  return useMemo(() => {
    const mergedAllowClear =
      !disabled &&
      allowClearConfig.allowClear !== false &&
      (displayValues.length || mergedSearchValue) &&
      !(mode === 'combobox' && mergedSearchValue === '');

    return {
      allowClear: mergedAllowClear,
      clearIcon: mergedAllowClear
        ? isReactRenderable(allowClearConfig.clearIcon)
          ? allowClearConfig.clearIcon
          : isReactRenderable(clearIcon)
            ? clearIcon
            : '×'
        : null,
      label: mergedAllowClear ? (allowClearConfig.label ?? 'Clear') : '',
    };
  }, [allowClearConfig, clearIcon, disabled, displayValues.length, mergedSearchValue, mode]);
};
