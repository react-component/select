import React from 'react';
import {getValuePropValue, getSelectKeys} from './util';
import Menu, {Item as MenuItem, ItemGroup as MenuItemGroup} from 'rc-menu';
import OptGroup from './OptGroup';
import assign from 'object-assign';

export default
class SelectDropdown extends React.Component {
  filterOption(input, child) {
    if (!input) {
      return true;
    }
    var filterOption = this.props.filterOption;
    if (!filterOption) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterOption.call(this, input, child);
  }

  renderFilterOptionsFromChildren(children, showNotFound) {
    var sel = [];
    var props = this.props;
    var inputValue = props.inputValue;
    var childrenKeys = [];
    var tags = props.tags;
    React.Children.forEach(children, (child)=> {
      if (child.type === OptGroup) {
        var innerItems = this.renderFilterOptionsFromChildren(child.props.children, false);
        if (innerItems.length) {
          var label = child.props.label;
          var key = child.key;
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
      var childValue = getValuePropValue(child);
      if (this.filterOption(inputValue, child)) {
        sel.push(<MenuItem
          value = {childValue}
          key = {childValue}
          {...child.props}
        />);
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });
    if (tags) {
      // tags value must be string
      var value = props.value;
      value = value.filter((v)=> {
        return childrenKeys.indexOf(v) === -1 && (!inputValue || v.indexOf(inputValue) > -1);
      });
      sel = sel.concat(value.map((v)=> {
        return <MenuItem value={v} key={v}>{v}</MenuItem>;
      }));
      if (inputValue) {
        var notFindInputItem = sel.every((s)=> {
          return getValuePropValue(s) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem value={inputValue} key={inputValue}>{inputValue}</MenuItem>);
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [<MenuItem disabled value='NOT_FOUND' key='NOT_FOUND'>{props.notFoundContent}</MenuItem>];
    }
    return sel;
  }

  renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.children, true);
  }

  renderMenu(menuItems) {
    var props = this.props;
    var menuProps = {};
    if (props.isMultipleOrTags) {
      menuProps.onDeselect = props.onMenuDeselect;
    }
    var value = props.value;
    var selectedKeys = getSelectKeys(menuItems, value);
    var activeKey;
    if (!props.isMultipleOrTags) {
      if (!activeKey && selectedKeys.length === 1) {
        activeKey = selectedKeys[0];
      }
    }
    return <Menu
      ref="menu"
      onSelect={props.onMenuSelect}
      activeFirst={true}
      activeKey={activeKey}
      multiple={props.isMultipleOrTags}
      focusable={false}
      {...menuProps}
      selectedKeys={selectedKeys}
      prefixCls={props.prefixCls + '-menu'}>
          {menuItems}
    </Menu>;
  }

  render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var menuItems = this.renderFilterOptions();
    var style = assign({}, props.dropdownStyle);
    var search = props.isMultipleOrTagsOrCombobox || !props.showSearch ? null :
      <span className={`${prefixCls}-search ${prefixCls}-search--dropdown`}>{props.inputElement}</span>;
    if (!search && !menuItems.length) {
      style.visibility = 'hidden';
    }
    // single and not combobox, input is inside dropdown
    return <span key="dropdown"
      onFocus={props.onDropdownFocus}
      onBlur={props.onDropdownBlur}
      style={style}
      className= {`${prefixCls}-dropdown ${prefixCls}-dropdown--below`}
      tabIndex="-1">
        {search}
        {this.renderMenu(menuItems)}
    </span>;
  }
}
