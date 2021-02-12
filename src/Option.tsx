/* istanbul ignore file */
import * as React from 'react';
import { OptionCoreData } from './interface';
import { Key } from './interface/generator';

export interface OptionProps<TKey extends Key = Key, TValue = any>
  extends Omit<OptionCoreData<TKey, TValue>, 'label'> {
  children: React.ReactNode;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionFC<TKey extends Key = Key, TValue = any>
  extends React.FC<OptionProps<TKey, TValue>> {
  /** Legacy for check if is a Option Group */
  isSelectOption: boolean;
}

/** This is a placeholder, not real render in dom */
const Option = <TKey extends Key = Key, TValue = any>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Parameters<OptionFC<TKey, TValue>>[0],
): ReturnType<OptionFC<TKey, TValue>> => null;
Option.isSelectOption = true;

export default Option;
