import React from 'react';
import { getValuePropValue, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE } from './util';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';
import warning from 'warning';

export default {
  filterOption(input, child) {
    if (!input) {
      return true;
    }
    const filterOption = this.props.filterOption;
    if (!filterOption) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterOption.call(this, input, child);
  },
  renderFilterOptions(inputValue) {
    return this.renderFilterOptionsFromChildren(this.props.children, true, inputValue);
  },

  renderFilterOptionsFromChildren(children, showNotFound, iv) {
    let sel = [];
    const props = this.props;
    const inputValue = iv === undefined ? this.state.inputValue : iv;
    const childrenKeys = [];
    const tags = props.tags;
    React.Children.forEach(children, (child) => {
      if (child.type.isSelectOptGroup) {
        const innerItems = this.renderFilterOptionsFromChildren(child.props.children, false);
        if (innerItems.length) {
          let label = child.props.label;
          let key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          sel.push(<MenuItemGroup key={key} title={label}>
            {innerItems}
          </MenuItemGroup>);
        }
        return;
      }

      warning(
        child.type.isSelectOption,
        'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
          `instead of \`${child.type.name || child.type.displayName || child.type}\`.`
      );

      const childValue = getValuePropValue(child);
      if (this.filterOption(inputValue, child)) {
        sel.push(<MenuItem
          style={UNSELECTABLE_STYLE}
          attribute={UNSELECTABLE_ATTRIBUTE}
          value={childValue}
          key={childValue}
          {...child.props}
        />);
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });
    if (tags) {
      // tags value must be string
      let value = this.state.value || [];
      value = value.filter((singleValue) => {
        return childrenKeys.indexOf(singleValue.key) === -1 &&
          (!inputValue || String(singleValue.key).indexOf(String(inputValue)) > -1);
      });
      sel = sel.concat(value.map((singleValue) => {
        const key = singleValue.key;
        return (<MenuItem
          style={UNSELECTABLE_STYLE}
          attribute={UNSELECTABLE_ATTRIBUTE}
          value={key}
          key={key}
        >
          {key}
        </MenuItem>);
      }));
      if (inputValue) {
        const notFindInputItem = sel.every((option) => {
          return getValuePropValue(option) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem
            style={UNSELECTABLE_STYLE}
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={inputValue}
            key={inputValue}
          >
            {inputValue}
          </MenuItem>);
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [<MenuItem
        style={UNSELECTABLE_STYLE}
        attribute={UNSELECTABLE_ATTRIBUTE}
        disabled
        value="NOT_FOUND"
        key="NOT_FOUND"
      >
        {props.notFoundContent}
      </MenuItem>];
    }
    return sel;
  },
};
