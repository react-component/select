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

export interface OptionCoreData<
  TValue extends RawValueType = RawValueType,
  TKey extends Key = Key
> {
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

export interface OptionData<TValue extends RawValueType = RawValueType, TKey extends Key = Key>
  extends OptionCoreData<TValue, TKey> {
  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionGroupData<
  TValue extends RawValueType = RawValueType,
  TKey extends Key = Key
> {
  key?: TKey;
  label?: React.ReactNode;
  options: Array<OptionData<TValue, TKey>>;
  className?: string;
  style?: React.CSSProperties;

  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type OptionsType<TValue extends RawValueType = RawValueType, TKey extends Key = Key> = Array<
  OptionData<TValue, TKey> | OptionGroupData<TValue, TKey>
>;

export interface FlattenOptionData<
  TValue extends RawValueType = RawValueType,
  TKey extends Key = Key
> {
  group?: boolean;
  groupOption?: boolean;
  key: string | number;
  data: OptionData<TValue, TKey> | OptionGroupData<TValue, TKey>;
}
