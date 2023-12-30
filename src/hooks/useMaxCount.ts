import React from 'react';
import SelectContext from '../SelectContext';
import type { SelectContextProps } from '../SelectContext';

const useMaxCount = (multiple: boolean) => {
  const { maxCount, rawValues } = React.useContext<SelectContextProps>(SelectContext) || {};
  const truncateLength = React.useMemo<number>(
    () => maxCount - rawValues?.size,
    [maxCount, rawValues?.size],
  );
  const shouldTruncate = React.useCallback(
    (overCount = true) => {
      if (!multiple || typeof maxCount === 'undefined') {
        return false;
      }
      return overCount ? truncateLength < 0 : truncateLength >= 0;
    },
    [multiple, maxCount, truncateLength],
  );
  return { truncateLength, shouldTruncate };
};

export default useMaxCount;
