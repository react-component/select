import type { DisplayValueType, Mode } from '../interface';
import type React from 'react';
import {
  type AllowClearConfig,
  isReactRenderable,
  useAllowClear as useClearConfig,
} from '@rc-component/util';
import { useMemo } from 'react';

interface ClearInfo extends AllowClearConfig {
  allowClear: boolean;
  clearIcon: React.ReactNode;
  label: string;
}

export const useAllowClear = (
  prefixCls: string,
  displayValues: DisplayValueType[],
  allowClear?: boolean | AllowClearConfig,
  clearIcon?: React.ReactNode,
  disabled: boolean = false,
  mergedSearchValue?: string,
  mode?: Mode,
): ClearInfo => {
  const allowClearConfig = useClearConfig(allowClear);

  return useMemo(() => {
    const mergedAllowClear =
      !disabled &&
      !allowClearConfig.disabled &&
      (displayValues.length || mergedSearchValue) &&
      !(mode === 'combobox' && mergedSearchValue === '');

    return {
      ...allowClearConfig,
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
