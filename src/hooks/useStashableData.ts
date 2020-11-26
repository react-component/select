import { useEffect, useState } from 'react';

export default ({
  data,
  setData,
}: {
  data: any;
  setData: (data?: any) => void;
}) => {
  const [stashedData, setStashedData] = useState<{
    data?: any;
    isStashed: boolean;
    isReadyToApply: boolean;
  }>({
    data: null,
    isStashed: false,
    isReadyToApply: false,
  });

  const hasStashedData: boolean = stashedData.isStashed;

  const stash = () => {
    if (!hasStashedData) {
      setStashedData({
        data,
        isStashed: true,
        isReadyToApply: false,
      });
      setData(undefined);
    }
  };

  const readyToApply = () => {
    if (hasStashedData) {
      setStashedData({
        ...stashedData,
        isReadyToApply: true,
      });
    }
  };

  const remove = () => setStashedData({ isStashed: false, isReadyToApply: false });

  const useIfReadyToApply = fn => {
    useEffect(() => {
      if (stashedData.isReadyToApply) {
        fn(stashedData.data);
      }
    }, [stashedData.isReadyToApply, stashedData.data])
  };

  return {
    data: stashedData.data,
    isStashed: stashedData.isStashed,
    stash,
    remove,
    readyToApply,
    useIfReadyToApply,
  };
};
