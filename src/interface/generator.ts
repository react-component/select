import { SelectProps, RefSelectProps } from '../generate';

// =================================== Shared Type ===================================
export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
}
export type DefaultValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export interface DisplayLabelValueType extends LabelValueType {
  disabled?: boolean;
}

// ==================================== Generator ====================================
export type GetLabeledValue<FOT extends FlattenOptionsType<any>> = (
  value: RawValueType,
  config: {
    options: FOT;
    prevValue: DefaultValueType;
    labelInValue: boolean;
    optionLabelProp: string;
  },
) => LabelValueType;

export type FilterOptions<OptionsType> = (
  searchValue: string,
  options: OptionsType,
  /** Component props, since Select & TreeSelect use different prop name, use any here */
  config: { optionFilterProp: string; filterOption: boolean | FilterFunc },
) => OptionsType;

export type FilterFunc = (inputValue: string, option?: any) => boolean;

export declare function RefSelectFunc<OptionsType extends object[], ValueType>(
  Component: React.RefForwardingComponent<RefSelectProps, SelectProps<OptionsType, ValueType>>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SelectProps<OptionsType, ValueType>> & React.RefAttributes<RefSelectProps>
>;

export type FlattenOptionsType<OptionsType extends object[]> = {
  key: Key;
  data: OptionsType[number];
  [name: string]: any;
}[];
