import toNodeArray from 'rc-util/lib/Children/toArray';
import warning, { noteOnce } from 'rc-util/lib/warning';
import * as React from 'react';
import { isMultiple } from '../BaseSelect';
import type {
  BaseOptionType,
  DefaultOptionType,
  FieldNames,
  LabelInValueType,
  RawValueType,
  SelectProps,
} from '../Select';
import { toArray } from './commonUtil';
import { convertChildrenToData } from './legacyUtil';

function warningProps(props: SelectProps) {
  const {
    mode,
    options,
    children,
    backfill,
    allowClear,
    placeholder,
    getInputElement,
    showSearch,
    onSearch,
    defaultOpen,
    autoFocus,
    labelInValue,
    value,
    inputValue,
    optionLabelProp,
  } = props;

  const multiple = isMultiple(mode);
  const mergedShowSearch = showSearch !== undefined ? showSearch : multiple || mode === 'combobox';
  const mergedOptions = options || convertChildrenToData(children);

  // `tags` should not set option as disabled
  warning(
    mode !== 'tags' || mergedOptions.every((opt: { disabled?: boolean }) => !opt.disabled),
    'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
  );

  // `combobox` & `tags` should option be `string` type
  if (mode === 'tags' || mode === 'combobox') {
    const hasNumberValue = mergedOptions.some((item) => {
      if (item.options) {
        return item.options.some(
          (opt: BaseOptionType) => typeof ('value' in opt ? opt.value : opt.key) === 'number',
        );
      }
      return typeof ('value' in item ? item.value : item.key) === 'number';
    });

    warning(
      !hasNumberValue,
      '`value` of Option should not use number type when `mode` is `tags` or `combobox`.',
    );
  }

  // `combobox` should not use `optionLabelProp`
  warning(
    mode !== 'combobox' || !optionLabelProp,
    '`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.',
  );

  // Only `combobox` support `backfill`
  warning(mode === 'combobox' || !backfill, '`backfill` only works with `combobox` mode.');

  // Only `combobox` support `getInputElement`
  warning(
    mode === 'combobox' || !getInputElement,
    '`getInputElement` only work with `combobox` mode.',
  );

  // Customize `getInputElement` should not use `allowClear` & `placeholder`
  noteOnce(
    mode !== 'combobox' || !getInputElement || !allowClear || !placeholder,
    'Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`.',
  );

  // `onSearch` should use in `combobox` or `showSearch`
  if (onSearch && !mergedShowSearch && mode !== 'combobox' && mode !== 'tags') {
    warning(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }

  noteOnce(
    !defaultOpen || autoFocus,
    '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autoFocus` if needed.',
  );

  if (value !== undefined && value !== null) {
    const values = toArray<RawValueType | LabelInValueType>(value);
    warning(
      !labelInValue ||
        values.every((val) => typeof val === 'object' && ('key' in val || 'value' in val)),
      '`value` should in shape of `{ value: string | number, label?: ReactNode }` when you set `labelInValue` to `true`',
    );

    warning(
      !multiple || Array.isArray(value),
      '`value` should be array when `mode` is `multiple` or `tags`',
    );
  }

  // Syntactic sugar should use correct children type
  if (children) {
    let invalidateChildType = null;
    toNodeArray(children).some((node: React.ReactNode) => {
      if (!React.isValidElement(node) || !node.type) {
        return false;
      }

      const { type } = node as { type: { isSelectOption?: boolean; isSelectOptGroup?: boolean } };

      if (type.isSelectOption) {
        return false;
      }
      if (type.isSelectOptGroup) {
        const allChildrenValid = toNodeArray(node.props.children).every(
          (subNode: React.ReactElement) => {
            if (
              !React.isValidElement(subNode) ||
              !node.type ||
              (subNode.type as { isSelectOption?: boolean }).isSelectOption
            ) {
              return true;
            }
            invalidateChildType = subNode.type;
            return false;
          },
        );

        if (allChildrenValid) {
          return false;
        }
        return true;
      }
      invalidateChildType = type;
      return true;
    });

    if (invalidateChildType) {
      warning(
        false,
        `\`children\` should be \`Select.Option\` or \`Select.OptGroup\` instead of \`${
          invalidateChildType.displayName || invalidateChildType.name || invalidateChildType
        }\`.`,
      );
    }

    warning(
      inputValue === undefined,
      '`inputValue` is deprecated, please use `searchValue` instead.',
    );
  }
}

// value in Select option should not be null
// note: OptGroup has options too
export function warningNullOptions(options: DefaultOptionType[], fieldNames: FieldNames) {
  if (options) {
    const recursiveOptions = (optionsList: DefaultOptionType[], inGroup: boolean = false) => {
      for (let i = 0; i < optionsList.length; i++) {
        const option = optionsList[i];

        if (option[fieldNames?.value] === null) {
          warning(false, '`value` in Select options should not be `null`.');
          return true;
        }

        if (
          !inGroup &&
          Array.isArray(option[fieldNames?.options]) &&
          recursiveOptions(option[fieldNames?.options], true)
        ) {
          break;
        }
      }
    };

    recursiveOptions(options);
  }
}

export default warningProps;
