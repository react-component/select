import {ItemGroup as MenuItemGroup} from 'rc-menu';
import React from 'react';

export function getValuePropValue(c) {
  var props = c.props;
  if ('value' in props) {
    return props.value;
  }
  if (c.key) {
    return c.key;
  }
  throw new Error('no key or value for ' + c);
}

export function getPropValue(c, prop) {
  if (prop === 'value') {
    return getValuePropValue(c);
  } else {
    return c.props[prop];
  }
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

export function normValue(value) {
  if (value === undefined) {
    value = [];
  } else if (!Array.isArray(value)) {
    value = [value];
  }
  return value;
}

export function getSelectKeys(menuItems, value) {
  if (value == null) {
    return [];
  }
  var selectedKeys = [];
  React.Children.forEach(menuItems, (item) => {
    if (item.type === MenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(item.props.children, value));
    } else {
      var itemValue = getValuePropValue(item);
      var itemKey = item.key;
      if (value.indexOf(itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}
