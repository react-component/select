// =================================== Shared Type ===================================
export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
}
export type ValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

// ==================================== Generator ====================================
export type GetLabeledValue<OptionsType> = (
  value: RawValueType,
  options: OptionsType,
  prevValue: ValueType,
) => LabelValueType;
