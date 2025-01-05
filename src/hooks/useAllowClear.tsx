import TransBtn from '../TransBtn';
import type { DisplayValueType, Mode, RenderNode } from '../interface';
import React from 'react';

export const useAllowClear = (
  prefixCls: string,
  onClearMouseDown: React.MouseEventHandler<HTMLSpanElement>,
  displayValues: DisplayValueType[],
  allowClear?: boolean | { clearIcon?: RenderNode },
  disabled: boolean = false,
  mergedSearchValue?: string,
  mode?: Mode,
) => {
  const clearIcon = React.useMemo(() => {
    if (typeof allowClear === 'object') {
      return allowClear.clearIcon;
    }
  }, [allowClear]);

  const mergedAllowClear = React.useMemo<boolean>(() => {
    if (
      !disabled &&
      !!allowClear &&
      (displayValues.length || mergedSearchValue) &&
      !(mode === 'combobox' && mergedSearchValue === '')
    ) {
      return true;
    }
    return false;
  }, [allowClear, disabled, displayValues.length, mergedSearchValue, mode]);

  return {
    allowClear: mergedAllowClear,
    clearIcon: (
      <TransBtn
        className={`${prefixCls}-clear`}
        onMouseDown={onClearMouseDown}
        customizeIcon={clearIcon}
      >
        ×
      </TransBtn>
    ),
  };
};
