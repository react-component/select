import React from 'react';
import {getSelectKeys} from './util';
import Menu from 'rc-menu';

const DropdownMenu = React.createClass({
  propTypes: {
    prefixCls: React.PropTypes.string,
    menuItems: React.PropTypes.any,
    search: React.PropTypes.any,
  },

  shouldComponentUpdate(nextProps) {
    // freeze when hide
    return nextProps.visible;
  },

  renderMenu() {
    const props = this.props;
    const menuItems = props.menuItems;
    if (menuItems && menuItems.length) {
      const menuProps = {};
      if (props.multiple) {
        menuProps.onDeselect = props.onMenuDeselect;
        menuProps.onSelect = props.onMenuSelect;
      } else {
        menuProps.onClick = props.onMenuSelect;
      }
      const value = props.value;
      const selectedKeys = getSelectKeys(menuItems, value);
      let activeKey;
      if (!props.multiple) {
        if (!activeKey && selectedKeys.length === 1) {
          activeKey = selectedKeys[0];
        }
      }
      return (<Menu
        ref="menu"
        style={props.dropdownMenuStyle}
        defaultActiveFirst
        activeKey={activeKey}
        multiple={props.multiple}
        focusable={false}
        {...menuProps}
        selectedKeys={selectedKeys}
        prefixCls={`${props.prefixCls}-menu`}>
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

export default DropdownMenu;
