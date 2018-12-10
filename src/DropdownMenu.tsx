import React, {
  cloneElement,
  FocusEventHandler,
  UIEventHandler,
  CSSProperties,
  ReactNode,
} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { valueType, renderSelect } from './PropTypes';
import toArray from 'rc-util/lib/Children/toArray';
import Menu from 'rc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import raf from 'raf';
import { getSelectKeys, preventDefaultEvent, saveRef } from './util';

export interface IMenuEvent {
  key: String;
  item: ReactNode;
  domEvent: Event;
  selectedKeys: String[];
}

export interface IDropdownMenuProps {
  ariaId: string;
  defaultActiveFirstOption: boolean;
  value: valueType;
  dropdownMenuStyle: CSSProperties;
  multiple: boolean;
  onPopupFocus: FocusEventHandler<HTMLDivElement>;
  onPopupScroll: UIEventHandler<HTMLDivElement>;
  onMenuDeselect: (e: IMenuEvent) => void;
  onMenuSelect: (e: IMenuEvent) => void;
  prefixCls: string;
  menuItems: any;
  inputValue: string | string[];
  visible: boolean;
  firstActiveValue: valueType;
  menuItemSelectedIcon: renderSelect;
  backfillValue: string;
}

export default class DropdownMenu extends React.Component<Partial<IDropdownMenuProps>> {
  static displayName = 'DropdownMenu';
  static propTypes = {
    ariaId: PropTypes.string,
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
    menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  };
  rafInstance: {
    cancel: () => void;
  };
  lastInputValue: string | string[];
  saveMenuRef: Menu;
  menuRef: Menu;
  lastVisible: boolean;
  firstActiveItem: any;
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
    return (
      (this.props.visible && !nextProps.visible) ||
      nextProps.visible ||
      nextProps.inputValue !== this.props.inputValue
    );
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
    const { visible, firstActiveValue } = this.props;
    const value = this.props.value as string[];
    if (!itemComponent || !visible) {
      return;
    }
    const scrollIntoViewOpts: {
      alignWithTop?: boolean;
      onlyScrollIfNeeded?: boolean;
    } = {
      onlyScrollIfNeeded: true,
    };
    if ((!value || value.length === 0) && firstActiveValue) {
      scrollIntoViewOpts.alignWithTop = true;
    }

    // Delay to scroll since current frame item position is not ready when pre view is by filter
    // https://github.com/ant-design/ant-design/issues/11268#issuecomment-406634462
    this.rafInstance = raf(() => {
      scrollIntoView(itemComponent, findDOMNode(this.menuRef), scrollIntoViewOpts);
    });
  };

  renderMenu() {
    const {
      menuItems,
      menuItemSelectedIcon,
      defaultActiveFirstOption,
      prefixCls,
      multiple,
      onMenuSelect,
      inputValue,
      backfillValue,
      onMenuDeselect,
      visible,
    } = this.props;
    const firstActiveValue = this.props.firstActiveValue as string;

    if (menuItems && menuItems.length) {
      const menuProps: Partial<{
        onDeselect: (e: IMenuEvent) => void;
        onSelect: (e: IMenuEvent) => void;
        onClick: (e: IMenuEvent) => void;
      }> = {};
      if (multiple) {
        menuProps.onDeselect = onMenuDeselect;
        menuProps.onSelect = onMenuSelect;
      } else {
        menuProps.onClick = onMenuSelect;
      }
      const value = this.props.value as string[];
      const selectedKeys = getSelectKeys(menuItems, value);
      const activeKeyProps: {
        activeKey?: string;
      } = {};

      let clonedMenuItems = menuItems;
      if (selectedKeys.length || firstActiveValue) {
        if (visible && !this.lastVisible) {
          activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
        } else if (!visible) {
          activeKeyProps.activeKey = null;
        }
        let foundFirst = false;
        // set firstActiveItem via cloning menus
        // for scroll into view
        const clone = item => {
          if (
            (!foundFirst && selectedKeys.indexOf(item.key) !== -1) ||
            (!foundFirst && !selectedKeys.length && firstActiveValue.indexOf(item.key) !== -1)
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
          itemIcon={multiple ? menuItemSelectedIcon : null}
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
        style={{
          overflow: 'auto',
          transform: 'translateZ(0)',
        }}
        id={this.props.ariaId}
        onFocus={this.props.onPopupFocus}
        onMouseDown={preventDefaultEvent}
        onScroll={this.props.onPopupScroll}
      >
        {renderMenu}
      </div>
    ) : null;
  }
}
