import React from 'react';
import useBaseProps from './useBaseProps';
import SelectContext from '../SelectContext';
import type { SelectContextProps } from '../SelectContext';

const useOverMaxCount = () => {
  const { multiple } = useBaseProps() || {};
  const { maxCount, rawValues } = React.useContext<SelectContextProps>(SelectContext) || {};
  return React.useMemo(
    () => ({
      isValidMaxCount: multiple && typeof maxCount !== 'undefined',
      overMaxCount: rawValues?.size >= maxCount,
      diff: maxCount - rawValues?.size,
    }),
    [maxCount, multiple, rawValues?.size],
  );
};

export default useOverMaxCount;
