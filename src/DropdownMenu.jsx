import React, { cloneElement, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import toArray from 'rc-util/lib/Children/toArray';
import Menu from 'rc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import { getSelectKeys, preventDefaultEvent } from './util';

const DropdownMenu = React.createClass({
  propTypes: {
    defaultActiveFirstOption: PropTypes.bool,
    value: PropTypes.any,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    onPopupFocus: PropTypes.func,
    onMenuDeSelect: PropTypes.func,
    onMenuSelect: PropTypes.func,
    prefixCls: PropTypes.string,
    menuItems: PropTypes.any,
    inputValue: PropTypes.string,
    visible: PropTypes.bool,
  },

  componentWillMount() {
    this.lastInputValue = this.props.inputValue;
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
    this.lastInputValue = props.inputValue;
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
    const {
      menuItems,
      defaultActiveFirstOption, value,
      prefixCls, multiple,
      onMenuSelect, inputValue,
    } = props;
    if (menuItems && menuItems.length) {
      const menuProps = {};
      if (multiple) {
        menuProps.onDeselect = props.onMenuDeselect;
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
          if (item.type.isMenuItemGroup) {
            const children = toArray(item.props.children).map(clone);
            return cloneElement(item, {}, children);
          }
          return clone(item);
        });
      }

      // clear activeKey when inputValue change
      if (inputValue !== this.lastInputValue) {
        activeKeyProps.activeKey = '';
      }

      return (<Menu
        ref="menu"
        style={this.props.dropdownMenuStyle}
        defaultActiveFirst={defaultActiveFirstOption}
        {...activeKeyProps}
        multiple={multiple}
        focusable={false}
        {...menuProps}
        selectedKeys={selectedKeys}
        prefixCls={`${prefixCls}-menu`}
      >
        {clonedMenuItems}
      </Menu>);
    }
    return null;
  },

  render() {
    const renderMenu = this.renderMenu();
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={this.props.onPopupFocus}
        onMouseDown={preventDefaultEvent}
      >
        {renderMenu}
      </div>
    ) : null;
  },
});

export default DropdownMenu;
