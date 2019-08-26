/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabIndex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 */

import { OptionsType as SelectOptionsType, Mode } from './interface';
import SelectOptionList from './OptionList';
import Option from './Option';
import OptGroup from './OptGroup';
import { convertChildrenToData as convertSelectChildrenToData } from './utils/legacyUtil';
import {
  getLabeledValue as getSelectLabeledValue,
  filterOptions as selectDefaultFilterOptions,
  isValueDisabled as isSelectValueDisabled,
} from './utils/valueUtil';
import generateSelector, { SelectProps } from './generate';
import { DefaultValueType } from './interface/generator';

interface SelectStaticProps {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
}

export default generateSelector<SelectOptionsType, SelectStaticProps>({
  prefixCls: 'rc-select',
  components: {
    optionList: SelectOptionList,
  },
  staticProps: {
    Option,
    OptGroup,
  },
  convertChildrenToData: convertSelectChildrenToData,
  getLabeledValue: getSelectLabeledValue,
  filterOptions: selectDefaultFilterOptions,
  isValueDisabled: isSelectValueDisabled,
});

export type SelectProps<ValueType extends DefaultValueType = DefaultValueType> = SelectProps<
  SelectOptionsType,
  ValueType
>;
