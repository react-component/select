import React from 'react';
import {getValuePropValue, getSelectKeys} from './util';
import Menu, {Item as MenuItem, ItemGroup as MenuItemGroup} from 'rc-menu';
import OptGroup from './OptGroup';
import assign from 'object-assign';
import {classSet} from 'rc-util';

class SelectDropdown extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

  getDropdownPrefixCls() {
    return this.props.prefixCls + '-dropdown';
  }

  renderFilterOptionsFromChildren(children, showNotFound) {
    let sel = [];
    const props = this.props;
    const inputValue = props.inputValue;
    const childrenKeys = [];
    const tags = props.tags;
    React.Children.forEach(children, (child)=> {
      if (child.type === OptGroup) {
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
      const childValue = getValuePropValue(child);
      if (this.filterOption(inputValue, child)) {
        sel.push(<MenuItem
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
      let value = props.value;
      value = value.filter((v)=> {
        return childrenKeys.indexOf(v) === -1 && (!inputValue || v.indexOf(inputValue) > -1);
      });
      sel = sel.concat(value.map((v)=> {
        return <MenuItem value={v} key={v}>{v}</MenuItem>;
      }));
      if (inputValue) {
        const notFindInputItem = sel.every((s)=> {
          return getValuePropValue(s) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem value={inputValue} key={inputValue}>{inputValue}</MenuItem>);
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [<MenuItem disabled value="NOT_FOUND" key="NOT_FOUND">{props.notFoundContent}</MenuItem>];
    }
    return sel;
  }

  renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.children, true);
  }

  renderMenu(menuItems) {
    const props = this.props;
    const menuProps = {};
    if (props.isMultipleOrTags) {
      menuProps.onDeselect = props.onMenuDeselect;
    }
    const value = props.value;
    const selectedKeys = getSelectKeys(menuItems, value);
    let activeKey;
    if (!props.isMultipleOrTags) {
      if (!activeKey && selectedKeys.length === 1) {
        activeKey = selectedKeys[0];
      }
    }
    return (<Menu
      ref="menu"
      style={props.dropdownMenuStyle}
      onSelect={props.onMenuSelect}
      defaultActiveFirst={true}
      activeKey={activeKey}
      multiple={props.isMultipleOrTags}
      focusable={false}
      {...menuProps}
      selectedKeys={selectedKeys}
      prefixCls={`${this.getDropdownPrefixCls()}-menu`}>
      {menuItems}
    </Menu>);
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const menuItems = this.renderFilterOptions();
    const style = assign({}, props.dropdownStyle);
    const search = props.isMultipleOrTagsOrCombobox || !props.showSearch ? null :
      <span className={`${prefixCls}-search ${prefixCls}-search--dropdown`}>{props.inputElement}</span>;
    if (!search && !menuItems.length) {
      style.visibility = 'hidden';
    }
    const className = {
      [dropdownPrefixCls]: 1,
      [`${dropdownPrefixCls}--below`]: 1,
      [`${dropdownPrefixCls}-hidden`]: !props.visible,
    };
    // single and not combobox, input is inside dropdown
    return (<span key="dropdown"
                 onFocus={props.onDropdownFocus}
                 onBlur={props.onDropdownBlur}
                 style={style}
                 className={classSet(className)}
                 tabIndex="-1">
        {search}
      {this.renderMenu(menuItems)}
    </span>);
  }

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
  }
}

SelectDropdown.propTypes = {
  filterOption: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
  visible: React.PropTypes.bool,
  prefixCls: React.PropTypes.string,
  children: React.PropTypes.any,
};

export default SelectDropdown;
