import TransBtn from '@/TransBtn';
import type { DisplayValueType, Mode } from '@/interface';
import type { ReactNode } from 'react';
import React from 'react';

export function useAllowClear(
    prefixCls,
    onClearMouseDown,
    allowClear?: boolean | { clearIcon?: ReactNode },
    clearIcon?: ReactNode,
    disabled = false,
    displayValues: DisplayValueType[] = [],
    mergedSearchValue?: string,
    mode?: Mode
) {
    const mergedClearIcon = React.useMemo(() => {
        if (typeof allowClear === "object") {
            return allowClear.clearIcon;
        }
        if (!!clearIcon) return clearIcon;
    }, [allowClear, clearIcon]);

    const mergedSampleAllowClear = allowClear !== undefined ? !!allowClear : !!clearIcon;

    const mergedAllowClear = React.useMemo(() => {
        if (
            !disabled &&
            mergedSampleAllowClear &&
            (displayValues.length || mergedSearchValue) &&
            !(mode === 'combobox' && mergedSearchValue === '')
        ) {
            return true;
        }
        return false;
    }, [mergedSampleAllowClear, disabled, displayValues.length, mergedSearchValue, mode]);

    return {
        allowClear: mergedAllowClear,
        clearIcon: (
            <TransBtn
                className={`${prefixCls}-clear`}
                onMouseDown={onClearMouseDown}
                customizeIcon={mergedClearIcon}
            >
                ×
            </TransBtn>
        )
    };
}
