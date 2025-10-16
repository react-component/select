import type { DisplayValueType, Mode } from '../interface';
import type React from 'react';
import { useMemo } from 'react';

export interface AllowClearConfig {
  allowClear: boolean;
  clearIcon: React.ReactNode;
}

export const useAllowClear = (
  prefixCls: string,
  displayValues: DisplayValueType[],
  allowClear?: boolean | { clearIcon?: React.ReactNode },
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
      clearIcon: mergedAllowClear ? allowClearConfig.clearIcon || clearIcon || '×' : null,
    };
  }, [allowClearConfig, clearIcon, disabled, displayValues.length, mergedSearchValue, mode]);
};
