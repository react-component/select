import warning from 'rc-util/lib/warning';
import {
  OptionsType as SelectOptionsType,
  OptionData,
  OptionGroupData,
  FlattenOptionData,
} from '../interface';
import { FilterFunc, RawValueType } from '../interface/generator';
import { toArray } from './commonUtil';

export function toOptionData(
  data?: object | number | string | Array<object | number | string>,
): OptionData[] | OptionData | undefined {
  if (
    typeof data === 'string'
    || typeof data === 'number'
    || data === null
  ) {
    return {
      value: data,
    } as OptionData;
  }
  if (Array.isArray(data)) {
    return data.map(v => toOptionData(v)) as OptionData[];
  }
  if (typeof data === 'object') {
    const result = { ...data } as OptionData;
    if (!('value' in result) && 'key' in result) {
      result.value = result.key;
    }
    return result as OptionData;
  }
  return undefined;
}


function getKey(data: OptionData | OptionGroupData, index: number) {
  const { key } = data;
  let value: RawValueType;

  if ('value' in data) {
    ({ value } = data);
  }

  if (key !== null && key !== undefined) {
    return key;
  }
  if (value !== undefined) {
    return value;
  }
  return `rc-index-key-${index}`;
}

/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions(options: SelectOptionsType): FlattenOptionData[] {
  const flattenList: FlattenOptionData[] = [];

  function dig(list: SelectOptionsType, isGroupOption: boolean) {
    list.forEach(data => {
      if (isGroupOption || !('options' in data)) {
        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
        });
      } else {
        // Option Group
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data,
        });

        dig(data.options, true);
      }
    });
  }

  dig(options, false);

  return flattenList as FlattenOptionData[];
}

/**
 * Inject `props` into `option` for legacy usage
 */
export function injectLegacyPropsIntoOption<T>(option: T): T {
  const newOption = { ...option };
  if (!('props' in newOption)) {
    Object.defineProperty(newOption, 'props', {
      get() {
        warning(
          false,
          'Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
        );
        return newOption;
      },
    });
  }

  return newOption;
}

function toRawString(content: React.ReactNode): string {
  return toArray(content).join('');
}

/** Filter single option if match the search text */
function getFilterFunction(optionFilterProp: string) {
  return (searchValue: string, option: OptionData | OptionGroupData) => {
    const lowerSearchText = searchValue.toLowerCase();

    // Group label search
    if ('options' in option) {
      return toRawString(option.label)
        .toLowerCase()
        .includes(lowerSearchText);
    }

    // Option value search
    const rawValue = option[optionFilterProp];
    const value = toRawString(rawValue).toLowerCase();
    return value.includes(lowerSearchText);
  };
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: SelectOptionsType,
  {
    optionFilterProp,
    filterOption,
  }: { optionFilterProp: string; filterOption: boolean | FilterFunc<SelectOptionsType[number]> },
) {
  const filteredOptions: SelectOptionsType = [];
  let filterFunc: FilterFunc<SelectOptionsType[number]>;

  if (filterOption === false) {
    return [...options];
  }
  if (typeof filterOption === 'function') {
    filterFunc = filterOption;
  } else {
    filterFunc = getFilterFunction(optionFilterProp);
  }

  options.forEach(item => {
    // Group should check child options
    if ('options' in item) {
      // Check group first
      const matchGroup = filterFunc(searchValue, item);
      if (matchGroup) {
        filteredOptions.push(item);
      } else {
        // Check option
        const subOptions = item.options.filter(subItem => filterFunc(searchValue, subItem));
        if (subOptions.length) {
          filteredOptions.push({
            ...item,
            options: subOptions,
          });
        }
      }

      return;
    }

    if (filterFunc(searchValue, injectLegacyPropsIntoOption(item))) {
      filteredOptions.push(item);
    }
  });

  return filteredOptions;
}

export function getSeparatedContent(text: string, tokens: string[]): string[] {
  if (!tokens || !tokens.length) {
    return null;
  }

  let match = false;

  function separate(str: string, [token, ...restTokens]: string[]) {
    if (!token) {
      return [str];
    }

    const list = str.split(token);
    match = match || list.length > 1;

    return list
      .reduce((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], [])
      .filter(unit => unit);
  }

  const list = separate(text, tokens);
  return match ? list : null;
}
