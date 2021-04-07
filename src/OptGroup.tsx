/* istanbul ignore file */
import type * as React from 'react';
import type { OptionGroupData } from './interface';

export interface OptGroupProps extends Omit<OptionGroupData, 'options'> {
  children?: React.ReactNode;
}

export interface OptionGroupFC extends React.FC<OptGroupProps> {
  /** Legacy for check if is a Option Group */
  isSelectOptGroup: boolean;
}

/** This is a placeholder, not real render in dom */
const OptGroup: OptionGroupFC = () => null;
OptGroup.isSelectOptGroup = true;

export default OptGroup;
