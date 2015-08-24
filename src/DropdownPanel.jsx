import React from 'react';
import {getSelectKeys} from './util';
import Menu from 'rc-menu';

const Panel = React.createClass({
  propTypes: {
    prefixCls: React.PropTypes.string,
    menuItems: React.PropTypes.any,
    search: React.PropTypes.any,
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.visible;
  },

  getDropdownPrefixCls() {
    return this.props.prefixCls + '-dropdown';
  },

  renderMenu() {
    const props = this.props;
    const menuItems = props.menuItems;
    if (menuItems && menuItems.length) {
      const menuProps = {};
      if (props.isMultipleOrTags) {
        menuProps.onDeselect = props.onMenuDeselect;
        menuProps.onSelect = props.onMenuSelect;
      } else {
        menuProps.onClick = props.onMenuSelect;
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
    return null;
  },
  render() {
    return (<div>
      {this.props.search}
      {this.renderMenu()}
    </div>);
  },
});

export default Panel;
