import Select from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import type { BaseOptionType, DefaultOptionType, SearchConfig, SelectProps } from './Select';
import BaseSelect from './BaseSelect';
import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  BaseSelectSemanticName,
  DisplayValueType,
  RefOptionListProps,
} from './BaseSelect';
import useBaseProps from './hooks/useBaseProps';
import type { OptionFC, OptionProps } from './Option';
import type { Placement } from './interface';

export { Option, OptGroup, BaseSelect, useBaseProps };
export type {
  BaseOptionType,
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  BaseSelectSemanticName,
  DefaultOptionType,
  DisplayValueType,
  OptionFC,
  OptionProps,
  Placement,
  RefOptionListProps,
  SearchConfig,
  SelectProps,
};

export default Select;
