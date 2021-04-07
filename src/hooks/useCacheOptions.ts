import * as React from 'react';
import type { RawValueType, FlattenOptionsType, Key } from '../interface/generator';

export default function useCacheOptions<
  OptionsType extends {
    value?: RawValueType;
    label?: React.ReactNode;
    key?: Key;
    disabled?: boolean;
  }[]
>(options: FlattenOptionsType<OptionsType>) {
  const prevOptionMapRef = React.useRef<Map<RawValueType, FlattenOptionsType<OptionsType>[number]>>(
    null,
  );

  const optionMap = React.useMemo(() => {
    const map: Map<RawValueType, FlattenOptionsType<OptionsType>[number]> = new Map();
    options.forEach((item) => {
      const {
        data: { value },
      } = item;
      map.set(value, item);
    });
    return map;
  }, [options]);

  prevOptionMapRef.current = optionMap;

  const getValueOption = (vals: RawValueType[]): FlattenOptionsType<OptionsType> =>
    vals.map((value) => prevOptionMapRef.current.get(value)).filter(Boolean);

  return getValueOption;
}
