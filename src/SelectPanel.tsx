import React from 'react';
import OptionList from './OptionList';
import SelectContext, { SelectContextProps } from './SelectContext';
import { SelectProps } from './Select';
import { flattenOptions } from './utils/valueUtil';
import { BaseSelectContext, BaseSelectContextProps } from './hooks/useBaseProps';
import { DisplayValueType, DisplayInfoType } from './interface';

const SelectPanel = (props: SelectProps) => {
  const { options } = props;

  const rawValues = React.useMemo(() => new Set([].map((val) => val.value)), []);

  const selectContext = React.useMemo<SelectContextProps>(() => {
    const data: SelectContextProps = {
      options,
      flattenOptions: [],
      onActiveValue: () => undefined,
      onSelect: () => undefined,
      rawValues,
    };
    return data;
  }, []);

  const baseSelectContext = React.useMemo<BaseSelectContextProps>(() => {
    const data: BaseSelectContextProps = {
      triggerOpen: false,
      multiple: false,
      toggleOpen: () => undefined,
      id: '',
      prefixCls: '',
      displayValues: [],
      onDisplayValuesChange: () => undefined,
      searchValue: '',
      onSearch: () => undefined,
      OptionList: undefined,
      emptyOptions: false,
    };
    return data;
  }, []);

  return (
    <>
      <SelectContext.Provider value={selectContext}>
        <BaseSelectContext.Provider value={baseSelectContext}>
          <OptionList />
        </BaseSelectContext.Provider>
      </SelectContext.Provider>
    </>
  );
};

export default SelectPanel;
