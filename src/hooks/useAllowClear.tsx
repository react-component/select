import TransBtn from '../TransBtn';
import type { DisplayValueType, Mode } from '../interface';
import type { ReactNode } from 'react';
import React from 'react';

export function useAllowClear(
    prefixCls,
    onClearMouseDown,
    displayValues: DisplayValueType[],
    allowClear?: boolean | { clearIcon?: ReactNode },
    clearIcon?: ReactNode,
    disabled = false,
    mergedSearchValue?: string,
    mode?: Mode
) {
    const mergedClearIcon = React.useMemo(() => {
        if (typeof allowClear === "object") {
            return allowClear.clearIcon;
        }
        if (!!clearIcon) return clearIcon;
    }, [allowClear, clearIcon]);


    const mergedAllowClear = React.useMemo(() => {
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
                customizeIcon={mergedClearIcon}
            >
                ×
            </TransBtn>
        )
    };
}
