import React, { cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import toArray from 'rc-util/lib/Children/toArray';
import Menu from 'rc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import raf from 'raf';
import { getSelectKeys, preventDefaultEvent, saveRef } from './util';

export default class DropdownMenu extends React.Component {
  static displayName = 'DropdownMenu';
  static propTypes = {
    defaultActiveFirstOption: PropTypes.bool,
    value: PropTypes.any,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    onPopupFocus: PropTypes.func,
    onPopupScroll: PropTypes.func,
    onMenuDeSelect: PropTypes.func,
    onMenuSelect: PropTypes.func,
    prefixCls: PropTypes.string,
    menuItems: PropTypes.any,
    inputValue: PropTypes.string,
    visible: PropTypes.bool,
    firstActiveValue: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.lastInputValue = props.inputValue;
    this.saveMenuRef = saveRef(this, 'menuRef');
  }

  componentDidMount() {
    this.scrollActiveItemToView();
    this.lastVisible = this.props.visible;
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.visible) {
      this.lastVisible = false;
    }
    // freeze when hide
    return nextProps.visible;
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView();
    }
    this.lastVisible = props.visible;
    this.lastInputValue = props.inputValue;
  }

  componentWillUnmount() {
    if (this.rafInstance && this.rafInstance.cancel) {
      this.rafInstance.cancel();
    }
  }

  scrollActiveItemToView = () => {
    // scroll into view
    const itemComponent = findDOMNode(this.firstActiveItem);
    const { value, visible, firstActiveValue } = this.props;

    if (!itemComponent || !visible) {
      return;
    }
    const scrollIntoViewOpts = {
      onlyScrollIfNeeded: true,
    };
    if (
      (!value || value.length === 0) && firstActiveValue
    ) {
      scrollIntoViewOpts.alignWithTop = true;
    }

    // Delay to scroll since current frame item position is not ready when pre view is by filter
    // https://github.com/ant-design/ant-design/issues/11268#issuecomment-406634462
    this.rafInstance = raf(() => {
      scrollIntoView(
        itemComponent,
        findDOMNode(this.menuRef),
        scrollIntoViewOpts
      );
    });
  };

  renderMenu() {
    const props = this.props;
    const {
      menuItems,
      defaultActiveFirstOption,
      value,
      prefixCls,
      multiple,
      onMenuSelect,
      inputValue,
      firstActiveValue,
      backfillValue,
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
      if (selectedKeys.length || firstActiveValue) {
        if (props.visible && !this.lastVisible) {
          activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
        }
        let foundFirst = false;
        // set firstActiveItem via cloning menus
        // for scroll into view
        const clone = item => {
          if (
            (!foundFirst && selectedKeys.indexOf(item.key) !== -1) ||
            (!foundFirst &&
              !selectedKeys.length &&
              firstActiveValue.indexOf(item.key) !== -1)
          ) {
            foundFirst = true;
            return cloneElement(item, {
              ref: ref => {
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
      } else {
        // Clear firstActiveItem when dropdown menu items was empty
        // Avoid `Unable to find node on an unmounted component`
        // https://github.com/ant-design/ant-design/issues/10774
        this.firstActiveItem = null;
      }

      // clear activeKey when inputValue change
      const lastValue = value && value[value.length - 1];
      if (inputValue !== this.lastInputValue && (!lastValue || lastValue !== backfillValue)) {
        activeKeyProps.activeKey = '';
      }
      return (
        <Menu
          ref={this.saveMenuRef}
          style={this.props.dropdownMenuStyle}
          defaultActiveFirst={defaultActiveFirstOption}
          role="listbox"
          {...activeKeyProps}
          multiple={multiple}
          {...menuProps}
          selectedKeys={selectedKeys}
          prefixCls={`${prefixCls}-menu`}
        >
          {clonedMenuItems}
        </Menu>
      );
    }
    return null;
  }

  render() {
    const renderMenu = this.renderMenu();
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={this.props.onPopupFocus}
        onMouseDown={preventDefaultEvent}
        onScroll={this.props.onPopupScroll}
      >
        {renderMenu}
      </div>
    ) : null;
  }
}
