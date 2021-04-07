/* istanbul ignore file */
import type * as React from 'react';
import type { OptionCoreData } from './interface';

export interface OptionProps extends Omit<OptionCoreData, 'label'> {
  children: React.ReactNode;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionFC extends React.FC<OptionProps> {
  /** Legacy for check if is a Option Group */
  isSelectOption: boolean;
}

/** This is a placeholder, not real render in dom */
const Option: OptionFC = () => null;
Option.isSelectOption = true;

export default Option;
