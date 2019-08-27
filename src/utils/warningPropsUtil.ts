import React from 'react';
import warning, { noteOnce } from 'rc-util/lib/warning';
import toArray from 'rc-util/lib/Children/toArray';
import { SelectProps } from '..';
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
  } = props;

  const mergedShowSearch =
    showSearch !== undefined ? showSearch : mode === 'tags' || mode === 'combobox';
  const multiple = mode === 'multiple' || mode === 'tags';
  const mergedOptions = options || convertChildrenToData(children);

  // `tags` should not set option as disabled
  warning(
    mode !== 'tags' || mergedOptions.every((opt: any) => !opt.disabled),
    'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
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
  if (onSearch && (!mergedShowSearch && mode !== 'combobox' && mode !== 'tags')) {
    warning(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }

  noteOnce(
    !defaultOpen || autoFocus,
    '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autoFocus` if needed.',
  );

  if (value !== undefined && value !== null) {
    const values: any[] = Array.isArray(value) ? value : [value];
    warning(
      !labelInValue ||
        values.every(val => typeof val === 'object' && ('key' in val || 'value' in val)),
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
    toArray(children).some((node: any) => {
      if (!React.isValidElement(node)) {
        return false;
      }

      const { type }: any = node;

      if (type.isSelectOption) {
        return false;
      }
      if (type.isSelectOptGroup) {
        const allChildrenValid = toArray((node.props as any).children).every((subNode: any) => {
          if (!React.isValidElement(subNode) || (subNode.type as any).isSelectOption) {
            return true;
          }
          invalidateChildType = subNode.type;
          return false;
        });

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
        `\`children\` should be \`Select.Option\` or \`Select.OptGroup\` instead of \`${invalidateChildType.displayName ||
          invalidateChildType.name ||
          invalidateChildType}\``,
      );
    }

    warning(
      inputValue === undefined,
      '`inputValue` is deprecated, please use `searchValue` instead.',
    );
  }
}

export default warningProps;
