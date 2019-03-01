import React, { ReactElement } from 'react';
import Option from './Option';
import { filterOptionType, IILableValueType, ISelectProps, valueType } from './PropTypes';

export function toTitle(title: string): string {
  if (typeof title === 'string') {
    return title;
  }
  return '';
}

export function getValuePropValue(child: any) {
  if (!child) {
    return null;
  }

  const props = child.props;
  if ('value' in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  if (child.type && child.type.isSelectOptGroup && props.label) {
    return props.label;
  }
  throw new Error(`Need at least a key or a value or a label (only for OptGroup) for ${child}`);
}

export function getPropValue(child: Option, prop?: any) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  return child.props[prop];
}

export function isMultiple(props: Partial<ISelectProps>) {
  return props.multiple;
}

export function isCombobox(props: Partial<ISelectProps>) {
  return props.combobox;
}

export function isMultipleOrTags(props: Partial<ISelectProps>) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props: Partial<ISelectProps>) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props: any) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value: valueType | undefined): valueType | undefined {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value as string];
  }
  return ret;
}

export function getMapKey(value: valueType) {
  return `${typeof value}-${value}`;
}

export function preventDefaultEvent(e: any) {
  e.preventDefault();
}

export function findIndexInValueBySingleValue(value: valueType | undefined, singleValue: string) {
  let index = -1;

  if (value) {
    for (let i = 0; i < (value as string[]).length; i++) {
      if (value[i] === singleValue) {
        index = i;
        break;
      }
    }
  }

  return index;
}

export function getLabelFromPropsValue(value: valueType | undefined, key: valueType) {
  let label;
  value = toArray(value);
  if (value) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < (value as string[]).length; i++) {
      if ((value as IILableValueType[])[i].key === key) {
        label = value[i].label;
        break;
      }
    }
  }
  return label;
}

export function getSelectKeys(menuItems: JSX.Element[], value?: string) {
  if (value === null || value === undefined) {
    return [];
  }
  let selectedKeys: string[] = [];
  React.Children.forEach(menuItems, item => {
    const type = (item as ReactElement<any>).type as any;
    if (type.isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(
        getSelectKeys((item as ReactElement<any>).props.children, value),
      );
    } else {
      const itemValue = getValuePropValue(item);
      const itemKey = (item as ReactElement<any>).key as string;
      if (findIndexInValueBySingleValue(value, itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}

export const UNSELECTABLE_STYLE: any = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE: any = {
  unselectable: 'on',
};

export function findFirstMenuItem(children: JSX.Element[]): JSX.Element | null {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if ((child.type as any).isMenuItemGroup) {
      const found = findFirstMenuItem(child.props.children);
      if (found) {
        return found;
      }
    } else if (!child.props.disabled) {
      return child;
    }
  }
  return null;
}

export function includesSeparators(str: string | string[], separators: string[]) {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < separators.length; ++i) {
    if (str.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

export function splitBySeparators(str: string | string[], separators: string[]) {
  const reg = new RegExp(`[${separators.join()}]`);
  return (str as string).split(reg).filter(token => token);
}

export function defaultFilterFn(input: string, child: any): filterOptionType | boolean {
  if (child.props.disabled) {
    return false;
  }
  const value = (toArray(getPropValue(child, this.props.optionFilterProp)) as string[]).join('');
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

export function validateOptionValue(value: string, props: any) {
  if (isSingleMode(props) || isMultiple(props)) {
    return;
  }
  if (typeof value !== 'string') {
    throw new Error(
      `Invalid \`value\` of type \`${typeof value}\` supplied to Option, ` +
        `expected \`string\` when \`tags/combobox\` is \`true\`.`,
    );
  }
}

export function saveRef(instance: any, name: string): (node: any) => void {
  return (node: JSX.Element) => {
    instance[name] = node;
  };
}

export function generateUUID(): string {
  if (process.env.NODE_ENV === 'test') {
    return 'test-uuid';
  }
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable-next-line:no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line:no-bitwise
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}
