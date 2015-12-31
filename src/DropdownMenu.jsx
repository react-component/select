import React from 'react';
import {findDOMNode} from 'react-dom';
import {getSelectKeys} from './util';
import Menu from 'rc-menu';

const DropdownMenu = React.createClass({
  propTypes: {
    prefixCls: React.PropTypes.string,
    menuItems: React.PropTypes.any,
    search: React.PropTypes.any,
  },

  componentDidMount() {
    this.scrollActiveItemToView();
  },

  shouldComponentUpdate(nextProps) {
    // freeze when hide
    return nextProps.visible;
  },

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView();
    }
  },

  scrollActiveItemToView() {
    // scroll into view
    const itemComponent = findDOMNode(this).querySelectorAll('[aria-selected=true]')[0];
    if (itemComponent) {
      const target = findDOMNode(itemComponent);
      target.parentNode.scrollTop = target.offsetTop;
    }
  },

  renderMenu() {
    const props = this.props;
    const { menuItems,
      defaultActiveFirstOption, value,
      dropdownMenuStyle, prefixCls,
      multiple, onMenuDeselect,
      onMenuSelect } = props;
    if (menuItems && menuItems.length) {
      const menuProps = {};
      if (multiple) {
        menuProps.onDeselect = onMenuDeselect;
        menuProps.onSelect = onMenuSelect;
      } else {
        menuProps.onClick = onMenuSelect;
      }
      const selectedKeys = getSelectKeys(menuItems, value);
      const activeKeyProps = {};
      if (!multiple) {
        activeKeyProps.activeKey = selectedKeys[0];
      }
      return (<Menu
        ref="menu"
        defaultActiveFirst={defaultActiveFirstOption}
        style={dropdownMenuStyle}
        {...activeKeyProps}
        multiple={multiple}
        focusable={false}
        {...menuProps}
        selectedKeys={selectedKeys}
        prefixCls={`${prefixCls}-menu`}>
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
