import * as React from 'react';
import { Key, RawValueType } from './generator';

export type RenderDOMFunc = (props: any) => HTMLElement;

export type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export type Mode = 'multiple' | 'tags' | 'combobox';

// ======================== Option ========================
export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export interface OptionCoreData<TKey extends Key = Key, TValue = any> {
  key?: TKey;
  disabled?: boolean;
  value: TValue;
  title?: string;
  options?: undefined;
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  /** @deprecated Only works when use `children` as option data */
  children?: React.ReactNode;
}

export interface OptionData<TKey extends Key = Key, TValue = any>
  extends OptionCoreData<TKey, TValue> {
  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionGroupData<TKey extends Key = Key, TValue = any> {
  key?: TKey;
  label?: React.ReactNode;
  options: Array<OptionData<TKey, TValue>>;
  className?: string;
  style?: React.CSSProperties;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type OptionsType<TKey extends Key = Key, TValue = any> = Array<
  OptionData<TKey, TValue> | OptionGroupData<TKey, TValue>
>;

export interface FlattenOptionData<TKey extends Key = Key, TValue = any> {
  group?: boolean;
  groupOption?: boolean;
  key: string | number;
  data: OptionData<TKey, TValue> | OptionGroupData<TKey, TValue>;
}
