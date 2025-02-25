import type { BaseOptionType, DefaultOptionType } from '../Select';
import warning from '@rc-component/util/lib/warning';
import type { RawValueType, FieldNames } from '../Select';
import type { FlattenOptionData } from '../interface';

function getKey(data: BaseOptionType, index: number) {
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

export function isValidCount(value?: number) {
  return typeof value !== 'undefined' && !Number.isNaN(value);
}

export function fillFieldNames(fieldNames: FieldNames | undefined, childrenAsData: boolean) {
  const { label, value, options, groupLabel } = fieldNames || {};
  const mergedLabel = label || (childrenAsData ? 'children' : 'label');

  return {
    label: mergedLabel,
    value: value || 'value',
    options: options || 'options',
    groupLabel: groupLabel || mergedLabel,
  };
}

/**
 * Flat options into flatten list.
 * We use `optionOnly` here is aim to avoid user use nested option group.
 * Here is simply set `key` to the index if not provided.
 */
export function flattenOptions<OptionType extends BaseOptionType = DefaultOptionType>(
  options: OptionType[],
  { fieldNames, childrenAsData }: { fieldNames?: FieldNames; childrenAsData?: boolean } = {},
): FlattenOptionData<OptionType>[] {
  const flattenList: FlattenOptionData<OptionType>[] = [];

  const {
    label: fieldLabel,
    value: fieldValue,
    options: fieldOptions,
    groupLabel,
  } = fillFieldNames(fieldNames, false);

  function dig(list: OptionType[], isGroupOption: boolean) {
    if (!Array.isArray(list)) {
      return;
    }

    list.forEach((data) => {
      if (isGroupOption || !(fieldOptions in data)) {
        const value = data[fieldValue];

        // Option
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
          label: data[fieldLabel],
          value,
        });
      } else {
        let grpLabel = data[groupLabel];
        if (grpLabel === undefined && childrenAsData) {
          grpLabel = data.label;
        }

        // Option Group
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data,
          label: grpLabel,
        });

        dig(data[fieldOptions], true);
      }
    });
  }

  dig(options, false);

  return flattenList;
}

/**
 * Inject `props` into `option` for legacy usage
 */
export function injectPropsWithOption<T extends object>(option: T): T {
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

export const getSeparatedContent = (text: string, tokens: string[], end?: number): string[] => {
  if (!tokens || !tokens.length) {
    return null;
  }
  let match = false;
  const separate = (str: string, [token, ...restTokens]: string[]): string[] => {
    if (!token) {
      return [str];
    }
    const list = str.split(token);
    match = match || list.length > 1;
    return list
      .reduce((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], [])
      .filter(Boolean);
  };
  const list = separate(text, tokens);
  if (match) {
    return typeof end !== 'undefined' ? list.slice(0, end) : list;
  } else {
    return null;
  }
};
