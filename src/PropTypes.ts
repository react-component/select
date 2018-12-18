import * as PropTypes from 'prop-types';
import {
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  UIEventHandler,
} from 'react';

export type emptyFunction = (e?: any) => void;

export interface IILableValueType {
  key?: string | number;
  label?: ReactNode | string;
}
export type valueType =
  | number
  | number[]
  | string
  | string[]
  | IILableValueType
  | IILableValueType[];

type renderNode = () => ReactNode;
export type filterOptionType = (inputValue: string, option?: any) => void;
export type renderSelect = ReactNode | renderNode;

export interface ISelectProps {
  id: string;
  defaultActiveFirstOption: boolean;
  multiple: boolean;
  combobox: boolean;
  autoClearSearchValue: boolean;
  filterOption: filterOptionType | boolean;
  children: JSX.Element[] | JSX.Element | any;
  showSearch: boolean;
  disabled: boolean;
  style: CSSProperties;
  allowClear: boolean;
  showArrow: boolean;
  tags: boolean;
  openClassName: string;
  autoFocus: boolean;
  prefixCls: string;
  className: string;
  transitionName: string;
  optionLabelProp: string;
  optionFilterProp: string;
  animation: string;
  choiceTransitionName: string;
  open: boolean;
  defaultOpen: boolean;
  inputValue: string;
  onChange: (value: valueType, option: JSX.Element | JSX.Element[]) => void;
  onBlur: emptyFunction;
  onFocus: emptyFunction;
  onSelect: (value: valueType, option: JSX.Element | JSX.Element[]) => void;
  onSearch: (value: string) => void;
  onDropdownVisibleChange: (open: boolean | undefined) => void;
  onPopupScroll: UIEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onInputKeyDown: KeyboardEventHandler<HTMLInputElement>;
  placeholder: string;
  onDeselect: (value: valueType, option: JSX.Element | JSX.Element[]) => void;
  labelInValue: boolean;
  loading: boolean;
  value: valueType;
  firstActiveValue: valueType;
  defaultValue: valueType;
  dropdownStyle: CSSProperties;
  maxTagTextLength: number;
  maxTagCount: number;
  maxTagPlaceholder: renderSelect;
  tokenSeparators: string[];
  getInputElement: () => JSX.Element;
  showAction: string[];
  clearIcon: ReactNode;
  inputIcon: ReactNode;
  removeIcon: ReactNode;
  menuItemSelectedIcon: renderSelect;
  getPopupContainer: renderSelect;
  dropdownRender: (menu: any) => JSX.Element;
  mode: 'multiple' | 'tags';
  backfill: boolean;
  dropdownAlign: any;
  dropdownClassName: string;
  dropdownMatchSelectWidth: boolean;
  dropdownMenuStyle: React.CSSProperties;
  notFoundContent: string | false;
  tabIndex: string | number;
}

function propsValueType(props: ISelectProps, propName: string, componentName: string) {
  const basicType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

  const labelInValueShape = PropTypes.shape({
    key: basicType,
    label: PropTypes.node,
  });
  if (props.labelInValue) {
    const validate = PropTypes.oneOfType([PropTypes.arrayOf(labelInValueShape), labelInValueShape]);
    PropTypes.checkPropTypes(validate, props, propName, componentName);

    // if value is no null, it's a object
    if (props[propName] && typeof props[propName] !== 'object') {
      throw new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`, ` +
          `when you set \`labelInValue\` to \`true\`, \`${propName}\` should in ` +
          `shape of \`{ key: string | number, label?: ReactNode }\`.`,
      );
    }
  } else if (
    (props.mode === 'multiple' || props.mode === 'tags' || props.multiple || props.tags) &&
    props[propName] === ''
  ) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`string\` supplied to \`${componentName}\`, ` +
        `expected \`array\` when \`multiple\` or \`tags\` is \`true\`.`,
    );
  } else {
    const validate = PropTypes.oneOfType([PropTypes.arrayOf(basicType), basicType]);
    PropTypes.checkPropTypes(validate, props, propName, componentName);
  }
  return null;
}

const SelectPropTypes = {
  id: PropTypes.string,
  defaultActiveFirstOption: PropTypes.bool,
  multiple: PropTypes.bool,
  filterOption: PropTypes.any,
  children: PropTypes.any,
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
  tags: PropTypes.bool,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  transitionName: PropTypes.string,
  optionLabelProp: PropTypes.string,
  optionFilterProp: PropTypes.string,
  animation: PropTypes.string,
  choiceTransitionName: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  onSearch: PropTypes.func,
  onPopupScroll: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  placeholder: PropTypes.any,
  onDeselect: PropTypes.func,
  labelInValue: PropTypes.bool,
  loading: PropTypes.bool,
  value: propsValueType,
  defaultValue: propsValueType,
  dropdownStyle: PropTypes.object,
  maxTagTextLength: PropTypes.number,
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  showAction: PropTypes.arrayOf(PropTypes.string),
  clearIcon: PropTypes.node,
  inputIcon: PropTypes.node,
  removeIcon: PropTypes.node,
  menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dropdownRender: PropTypes.func,
};

export default SelectPropTypes;
