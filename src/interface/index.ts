import * as React from 'react';
import { Key } from './generator';

export type RenderNode = React.ReactNode | (() => React.ReactNode);

// ======================== Option ========================
export interface OptionData {
  key?: Key;
  disabled?: boolean;
  value: Key;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactElement;

  /** Save for customize data */
  [prop: string]: any;
}

export interface OptionGroupData {
  key?: Key;
  label?: React.ReactElement;
  options: OptionData[];
  className?: string;
  style?: React.CSSProperties;
}

export type OptionsType = (OptionData | OptionGroupData)[];

export interface FlattenOptionData {
  group?: boolean;
  groupOption?: boolean;
  key: string | number;
  data: OptionData | OptionGroupData;
}
