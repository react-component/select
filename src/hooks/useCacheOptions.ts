import * as React from 'react';
import { RawValueType, FlattenOptionsType, Key } from '../interface/generator';

export default function useCacheOptions<
  OptionsType extends {
    value?: RawValueType;
    label?: React.ReactNode;
    key?: Key;
    disabled?: boolean;
  }[]
>(
  values: RawValueType[],
  options: FlattenOptionsType<OptionsType>,
): Map<RawValueType, OptionsType[number]> {
  const prevOptionMapRef = React.useRef<Map<RawValueType, OptionsType[number]>>(null);

  const optionMap = React.useMemo(() => {
    const map: Map<RawValueType, OptionsType[number]> = new Map();
    options.forEach(item => {
      if (!item.group) {
        const { data } = item;
        // Check if match
        map.set(data.value, data);
      }
    });
    return map;
  }, [values, options]);

  prevOptionMapRef.current = optionMap;

  return optionMap;
}
