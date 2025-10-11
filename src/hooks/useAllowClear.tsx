import TransBtn from '../TransBtn';
import type { DisplayValueType, Mode, RenderNode } from '../interface';
import React, { useMemo } from 'react';

export interface AllowClearConfig {
  allowClear: boolean;
  clearIcon: React.ReactNode;
}

export const useAllowClear = (
  prefixCls: string,
  onClearMouseDown: React.MouseEventHandler<HTMLSpanElement>,
  displayValues: DisplayValueType[],
  allowClear?: boolean | { clearIcon?: RenderNode },
  clearIcon?: RenderNode,
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
      clearIcon: mergedAllowClear ? (
        <TransBtn
          className={`${prefixCls}-clear`}
          onMouseDown={onClearMouseDown}
          customizeIcon={allowClearConfig.clearIcon || clearIcon}
        >
          ×
        </TransBtn>
      ) : null,
    };
  }, [
    allowClearConfig,
    clearIcon,
    disabled,
    displayValues.length,
    mergedSearchValue,
    mode,
    onClearMouseDown,
    prefixCls,
  ]);
};
