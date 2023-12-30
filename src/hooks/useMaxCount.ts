import React from 'react';
import SelectContext from '../SelectContext';
import type { SelectContextProps } from '../SelectContext';

const useMaxCount = (multiple: boolean) => {
  const { maxCount, rawValues } = React.useContext<SelectContextProps>(SelectContext);
  return {
    shouldTruncate: React.useCallback(
      (overCount = true) => {
        if (!multiple || typeof maxCount === 'undefined') {
          return false;
        }
        const overMaxCount = rawValues?.size >= maxCount;
        return overCount ? overMaxCount : !overMaxCount;
      },
      [multiple, maxCount, rawValues?.size],
    ),
    truncateLength: React.useMemo<number>(
      () => maxCount - rawValues?.size,
      [maxCount, rawValues?.size],
    ),
  };
};

export default useMaxCount;
