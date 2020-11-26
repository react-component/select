import { useState, useMemo, useRef } from 'react';
import {
  FlattenOptionData,
  OptionData,
  OptionsType,
} from '../interface';
import { RawValueType, DisplayLabelValueType } from '../interface/generator';
import { toArray, toMap, toMapByValue } from '../utils/commonUtil';
import {
  toOptionData,
  injectLegacyPropsIntoOption,
} from '../utils/valueUtil';
import useStashableData from './useStashableData';

export default ({
  convertChildrenToData,
  searchValue,
  receiveRawValue,
  showSearch,
  filterOptions,
  filterOption,
  filterSort,
  flattenOptions,
  optionFilterProp,
  optionSelectedLabelProp,
  optionSelectableLabelProp,
  mode,
  propsValue,
  propsDefaultValue,
  propsChildren,
  propsOptions,
}) => {
  const providedOptionsData: OptionsType = useMemo(() => {
    const result =
      propsOptions !== undefined ? propsOptions : convertChildrenToData(propsChildren);

    return result !== null ? result : ([] as OptionsType);
  }, [propsOptions, propsChildren]);

  const [requestedSelectedOptions, requestSetSelectedOptions] = useState<OptionData[]>(undefined);
  const selectedOptions: OptionData[] = useMemo(() =>
    toArray(toOptionData([
      propsValue,
      requestedSelectedOptions,
      propsDefaultValue,
    ].find(x => x !== undefined))),
    [propsValue, requestedSelectedOptions, propsDefaultValue],
  );

  const stashedOption = useStashableData({
    data: requestedSelectedOptions,
    setData: requestSetSelectedOptions,
  });

  const stashedOptionsMap = useMemo(
    () => toMapByValue(stashedOption.data || []),
    [stashedOption.data],
  );

  const rawValue = useMemo<RawValueType[]>(() => {
    // For unit test: "Select.Combobox should hide clear icon when value is ''"
    // This means that the empty string cannot be itself a value that could be cleared
    // to default back to the value provided by `defaultValue`
    if (mode === 'combobox' && selectedOptions.length && selectedOptions[0].value === '') {
      return [];
    }

    return selectedOptions.map(({ key, value }) =>
      [value, key].find(x => x !== undefined),
    ) as RawValueType[];
  }, [selectedOptions]);

  /** We cache a set of raw values to speed up check */
  const rawValues = useMemo<Set<RawValueType>>(() => new Set(rawValue), [rawValue]);

  const selectedOptionsMap: Map<RawValueType, OptionData> = useMemo(
    () => toMapByValue(selectedOptions),
    [selectedOptions],
  );

  const providedSelectableOptionsMap: Map<RawValueType, OptionsType[number]> = useMemo(
    () => toMap(
      flattenOptions(providedOptionsData)
        .filter(flattenedOption => !flattenedOption.group),
      flattenedOption => flattenedOption.data.value,
      flattenedOption => flattenedOption.data,
    ),
    [providedOptionsData],
  );

  const options: OptionsType = useMemo(() => {
    if (mode === 'tags') {
      const result = [...providedOptionsData] as OptionsType;
      // For all selected option values that do not have a corresponding selectable option,
      // add selectable options (in alphabetical order) for these values to the end/bottom
      // of the options data
      [...rawValues].sort().forEach(value => {
        if (!providedSelectableOptionsMap.has(value)) {
          result.push({
            value,
            [optionSelectedLabelProp]: value,
            [optionSelectableLabelProp]: value,
          });
        }
      });
      return result;
    }

    return providedOptionsData;
  }, [
    providedOptionsData,
    providedSelectableOptionsMap,
    mode,
    rawValues,
    optionSelectedLabelProp,
    optionSelectableLabelProp,
  ]);

  const flattenedOptions: FlattenOptionData[] = useMemo(
    () => flattenOptions(options),
    [options],
  );

  const selectableOptionsMap: Map<RawValueType, OptionData> = useMemo(() =>
    toMap(
      flattenedOptions.filter(o => !o.group) as OptionData[],
      flatOption => flatOption.data.value,
      flatOption => flatOption.data,
    ),
    [flattenedOptions],
  );

  // Display options for OptionList
  const displayOptions = useMemo(() => {
    let filteredOptions: OptionsType;

    if (!searchValue || !showSearch) {
      filteredOptions = [...options] as OptionsType;
    } else {
      filteredOptions = filterOptions(
        searchValue,
        options.map(o => injectLegacyPropsIntoOption(o)) as OptionsType,
        {
          optionFilterProp,
          filterOption: mode === 'combobox' && filterOption === undefined
            ? () => true
            : filterOption,
        },
      );

      if (mode === 'tags' && filteredOptions.every(opt => opt[optionFilterProp] !== searchValue)) {
        filteredOptions.unshift({
          value: searchValue,
          key: '__RC_SELECT_TAG_PLACEHOLDER__',
        });
      }

      if (filterSort && Array.isArray(filteredOptions)) {
        filteredOptions = ([...filteredOptions] as OptionsType).sort(filterSort);
      }
    }

    return flattenOptions(filteredOptions);
  }, [
    options,
    searchValue,
    mode,
    showSearch,
    filterSort,
    optionFilterProp,
  ]);

  const providedValuesOptionDataMap = useMemo(
    () =>
      toMapByValue([
        ...toArray(toOptionData(propsDefaultValue)),
        ...toArray(toOptionData(propsValue)),
      ].filter(Boolean)),
    [propsValue, propsDefaultValue],
  );

  const cachedDisplayValueLabelsRef = useRef(new Map());

  function toCollectedOptionData(v: RawValueType): OptionData {
    return {
      ...selectedOptionsMap.get(v),
      ...selectableOptionsMap.get(v),
      value: v,
      [optionSelectedLabelProp]: [
        (selectedOptionsMap.get(v) || {} as any)[optionSelectedLabelProp],
        (selectableOptionsMap.get(v) || {} as any)[optionSelectedLabelProp],
        (providedValuesOptionDataMap.get(v) || {} as any)[optionSelectedLabelProp],
        (stashedOptionsMap.get(v) || {} as any)[optionSelectedLabelProp],
        (selectedOptionsMap.get(v) || {} as any).label,
        (selectableOptionsMap.get(v) || {} as any).label,
        (providedValuesOptionDataMap.get(v) || {} as any).label,
        (stashedOptionsMap.get(v) || {} as any).label,
        (cachedDisplayValueLabelsRef.current?.get(v)),
        v,
      ].find(x => x !== undefined),
      [optionSelectableLabelProp]: [
        (selectedOptionsMap.get(v) || {} as any)[optionSelectableLabelProp],
        (selectableOptionsMap.get(v) || {} as any)[optionSelectableLabelProp],
        (providedValuesOptionDataMap.get(v) || {} as any)[optionSelectableLabelProp],
        (stashedOptionsMap.get(v) || {} as any)[optionSelectableLabelProp],
        (selectedOptionsMap.get(v) || {} as any).label,
        (selectableOptionsMap.get(v) || {} as any).label,
        (providedValuesOptionDataMap.get(v) || {} as any).label,
        (stashedOptionsMap.get(v) || {} as any).label,
        (cachedDisplayValueLabelsRef.current?.get(v)),
        v,
      ].find(x => x !== undefined),
    };
  }

  const displayValues: DisplayLabelValueType[] = useMemo(() => {
    const result = rawValue.map(v => {
      const {
        value,
        [optionSelectedLabelProp]: label,
        disabled,
      } = toCollectedOptionData(v);
      return {
        key: value,
        value,
        label,
        disabled,
      };
    });

    if (
      !mode &&
      result.length === 1 &&
      result[0].value === null &&
      result[0].label === null
    ) {
      return [];
    }

    return result;
  }, [selectedOptions, options, mode, rawValue]);

  // Cache any display labels that differ from their value
  displayValues.forEach(({ value, label }) => {
    if (value !== label) {
      cachedDisplayValueLabelsRef.current.set(value, label);
    }
  });

  const toReceivableValue = newRawValue => {
    if (receiveRawValue) {
      return newRawValue;
    }

    const {
      value,
      [optionSelectedLabelProp]: label,
    } = toCollectedOptionData(newRawValue);

    return {
      value,
      label,
      key: value,
    };
  };

  const toReceivableOption = (value: RawValueType) => {
    let optionData = {};
    if ([
      selectableOptionsMap.get(value),
      selectedOptionsMap.get(value),
    ].some(x => x !== undefined)) {
      // If the provided value is present either within the selectable options or
      // the selected options, return this option's collected option data
      optionData = toCollectedOptionData(value);
    }

    return injectLegacyPropsIntoOption({ ...optionData });
  };

  return {
    selectedOptions,
    rawValue,
    rawValues,
    options,
    flattenedOptions,
    displayOptions,
    displayValues,
    stashedOption,
    toCollectedOptionData,
    toReceivableValue,
    toReceivableOption,
    requestSetSelectedOptions,
  };
};
