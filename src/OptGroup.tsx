/* istanbul ignore file */
import * as React from 'react';
import { OptionGroupData } from './interface';
import { Key } from './interface/generator';

export interface OptGroupProps<TKey extends Key = Key>
  extends Omit<OptionGroupData<TKey>, 'options'> {
  children?: React.ReactNode;
}

export interface OptionGroupFC<TKey extends Key = Key> extends React.FC<OptGroupProps<TKey>> {
  /** Legacy for check if is a Option Group */
  isSelectOptGroup: boolean;
}

/** This is a placeholder, not real render in dom */
const OptGroup = <TKey extends Key = Key>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Parameters<OptionGroupFC<TKey>>[0],
): ReturnType<OptionGroupFC<TKey>> => null;
OptGroup.isSelectOptGroup = true;

export default OptGroup;
