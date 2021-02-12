/* istanbul ignore file */
import * as React from 'react';
import { OptionCoreData } from './interface';
import { Key } from './interface/generator';

export interface OptionProps<TValue extends RawValueType = RawValueType, TKey extends Key = Key>
  extends Omit<OptionCoreData<TValue, TKey>, 'label'> {
  children: React.ReactNode;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionFC<TValue extends RawValueType = RawValueType, TKey extends Key = Key>
  extends React.FC<OptionProps<TValue, TKey>> {
  /** Legacy for check if is a Option Group */
  isSelectOption: boolean;
}

/** This is a placeholder, not real render in dom */
const Option = <TValue extends RawValueType = RawValueType, TKey extends Key = Key>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Parameters<OptionFC<TValue, TKey>>[0],
): ReturnType<OptionFC<TValue, TKey>> => null;
Option.isSelectOption = true;

export default Option;
