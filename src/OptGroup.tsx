import { Component } from 'react';

export interface IOptGroupProps {
  label: string;
  value: string | number;
  key: string | number;
  // Everything for testing
  testprop?: any;
}
export default class OptGroup extends Component<Partial<IOptGroupProps>> {
  public static isSelectOptGroup = true;
}
