import React, {cloneElement, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {getSelectKeys} from './util';
import Menu, {ItemGroup as MenuItemGroup} from 'rc-menu';
import scrollIntoView from 'dom-scroll-into-view';

const DropdownMenu = React.createClass({
  propTypes: {
    prefixCls: PropTypes.string,
    menuItems: PropTypes.any,
    search: PropTypes.any,
    visible: PropTypes.bool,
  },

  componentDidMount() {
    this.scrollActiveItemToView();
    this.lastVisible = this.props.visible;
  },

  shouldComponentUpdate(nextProps) {
    if (!nextProps.visible) {
      this.lastVisible = false;
    }
    // freeze when hide
    return nextProps.visible;
  },

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView();
    }
    this.lastVisible = props.visible;
  },

  scrollActiveItemToView() {
    // scroll into view
    const itemComponent = findDOMNode(this.firstActiveItem);
    if (itemComponent) {
      scrollIntoView(itemComponent, findDOMNode(this.refs.menu), {
        onlyScrollIfNeeded: true,
      });
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

      let clonedMenuItems = menuItems;
      if (selectedKeys.length) {
        if (props.visible && !this.lastVisible) {
          activeKeyProps.activeKey = selectedKeys[0];
        }
        let foundFirst = false;
        // set firstActiveItem via cloning menus
        // for scroll into view
        const clone = (item) => {
          if (!foundFirst && selectedKeys.indexOf(item.key) !== -1) {
            foundFirst = true;
            return cloneElement(item, {
              ref: (ref) => {
                this.firstActiveItem = ref;
              },
            });
          }
          return item;
        };

        clonedMenuItems = menuItems.map(item => {
          if (item.type === MenuItemGroup) {
            const children = item.props.children.map(clone);
            return cloneElement(item, {}, children);
          }
          return clone(item);
        });
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
        {clonedMenuItems}
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
