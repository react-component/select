import * as React from 'react';

export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
}
export type ValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export type RenderNode = React.ReactNode | (() => React.ReactNode);

// ======================== Option ========================
export interface OptionData {
  key?: Key;
  disabled?: boolean;
  value: Key;
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactElement;
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
