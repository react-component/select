import * as React from 'react';
import { Key, OptionData } from './interface';

export interface OptionProps extends Omit<OptionData, 'label'> {
  children: React.ReactNode;
}

/** This is a placeholder, not real render in dom */
const Option: React.FC<OptionProps> = () => null;

export default Option;
