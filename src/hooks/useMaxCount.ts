import React from 'react';
import SelectContext from '../SelectContext';
import type { SelectContextProps } from '../SelectContext';

const useMaxCount = (multiple: boolean) => {
  const { maxCount, rawValues } = React.useContext<SelectContextProps>(SelectContext) || {};
  return React.useMemo(
    () => ({
      isValidMaxCount: multiple && typeof maxCount !== 'undefined',
      overMaxCount: rawValues?.size >= maxCount,
      diff: maxCount - rawValues?.size,
    }),
    [multiple, maxCount, rawValues?.size],
  );
};

export default useMaxCount;
