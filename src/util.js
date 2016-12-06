import { ItemGroup as MenuItemGroup } from 'rc-menu';
import React from 'react';

export function getValuePropValue(child) {
  const props = child.props;
  if ('value' in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  throw new Error(`no key or value for ${child}`);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  return child.props[prop];
}

export function isCombobox(props) {
  return props.combobox;
}

export function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value) {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export function findIndexInValueByKey(value, key) {
  let index = -1;
  for (let i = 0; i < value.length; i++) {
    if (String(value[i].key) === String(key)) {
      index = i;
      break;
    }
  }
  return index;
}

export function findIndexInValueByLabel(value, label) {
  let index = -1;
  for (let i = 0; i < value.length; i++) {
    if (toArray(value[i].label).join('') === label) {
      index = i;
      break;
    }
  }
  return index;
}

export function getSelectKeys(menuItems, value) {
  if (value === null || value === undefined) {
    return [];
  }
  let selectedKeys = [];
  React.Children.forEach(menuItems, (item) => {
    if (item.type === MenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(item.props.children, value));
    } else {
      const itemValue = getValuePropValue(item);
      const itemKey = item.key;
      if (findIndexInValueByKey(value, itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}


export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
};

export function findFirstMenuItem(children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === MenuItemGroup) {
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

export function includesSeparators(string, separators) {
  for (let i = 0; i < separators.length; ++i) {
    if (string.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

export function splitBySeparators(string, separators) {
  const reg = new RegExp(`[${separators.join()}]`);
  const array = string.split(reg);
  if (array[0] === '') {
    array.shift();
  }
  if (array[array.length - 1] === '') {
    array.pop();
  }
  return array;
}
