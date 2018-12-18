import * as PropTypes from 'prop-types';
import { Component } from 'react';

export interface IOptProps {
  title: string | number;
  label: string | number;
  value: string | number;
  key: string | number;
  className: string;
  disabled: boolean;
  // Everything for testing
  testprop?: any;
}
export default class Option extends Component<Partial<IOptProps>> {
  public static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  public static isSelectOption = true;
}
