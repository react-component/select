import * as React from 'react';
import { Key } from './generator';

export type RenderNode = React.ReactNode | (() => React.ReactNode);

export type Mode = 'multiple' | 'tags' | 'combobox';

// ======================== Option ========================
export interface OptionData {
  key?: Key;
  disabled?: boolean;
  value: Key;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;

  /** Save for customize data */
  [prop: string]: any;
}

export interface OptionGroupData {
  key?: Key;
  label?: React.ReactNode;
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
