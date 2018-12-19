import scrollIntoView from 'dom-scroll-into-view';
import * as PropTypes from 'prop-types';
import raf from 'raf';
import Menu from 'rc-menu';
import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { renderSelect, valueType } from './PropTypes';
import { getSelectKeys, preventDefaultEvent, saveRef } from './util';

export interface IMenuEvent {
  key: string;
  item: React.ReactNode;
  domEvent: Event;
  selectedKeys: string[];
}

export interface IDropdownMenuProps {
  ariaId: string;
  defaultActiveFirstOption: boolean;
  value: valueType;
  dropdownMenuStyle: React.CSSProperties;
  multiple: boolean;
  onPopupFocus: React.FocusEventHandler<HTMLDivElement>;
  onPopupScroll: React.UIEventHandler<HTMLDivElement>;
  onMenuDeselect: (e: { item: any; domEvent: KeyboardEvent }) => void;
  onMenuSelect: (e: { item: any; domEvent: KeyboardEvent }) => void;
  prefixCls: string;
  menuItems: JSX.Element[];
  inputValue: string | string[];
  visible: boolean;
  firstActiveValue: valueType;
  menuItemSelectedIcon: renderSelect;
  backfillValue: string;
}

export default class DropdownMenu extends React.Component<Partial<IDropdownMenuProps>> {
  public static displayName = 'DropdownMenu';
  public static propTypes = {
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
  public rafInstance: {
    cancel: () => void;
  } = { cancel: () => null };
  public lastInputValue: string | string[] | undefined;
  public saveMenuRef: any;
  public menuRef: any;
  public lastVisible: boolean = false;
  public firstActiveItem: any;
  constructor(props: Partial<IDropdownMenuProps>) {
    super(props);
    this.lastInputValue = props.inputValue;
    this.saveMenuRef = saveRef(this, 'menuRef');
  }

  public componentDidMount() {
    this.scrollActiveItemToView();
    this.lastVisible = this.props.visible as boolean;
  }

  public shouldComponentUpdate(nextProps: Partial<IDropdownMenuProps>) {
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

  public componentDidUpdate(prevProps: Partial<IDropdownMenuProps>) {
    const props = this.props;
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView();
    }
    this.lastVisible = props.visible as boolean;
    this.lastInputValue = props.inputValue as string;
  }

  public componentWillUnmount() {
    if (this.rafInstance && this.rafInstance.cancel) {
      this.rafInstance.cancel();
    }
  }

  public scrollActiveItemToView = () => {
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

  public renderMenu = () => {
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
        onDeselect: (e: { item: any; domEvent: KeyboardEvent }) => void;
        onSelect: (e: { item: any; domEvent: KeyboardEvent }) => void;
        onClick: (e: { item: any; domEvent: KeyboardEvent }) => void;
      }> = {};
      if (multiple) {
        menuProps.onDeselect = onMenuDeselect;
        menuProps.onSelect = onMenuSelect;
      } else {
        menuProps.onClick = onMenuSelect;
      }
      const value = this.props.value as string;
      const selectedKeys = getSelectKeys(menuItems, value) as string[];
      const activeKeyProps: {
        activeKey?: string;
      } = {};

      let clonedMenuItems = menuItems;
      if (selectedKeys.length || firstActiveValue) {
        if (visible && !this.lastVisible) {
          activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
        } else if (!visible) {
          activeKeyProps.activeKey = undefined;
        }
        let foundFirst = false;
        // set firstActiveItem via cloning menus
        // for scroll into view
        const clone = (item: any) => {
          const key = item.key as string;
          if (
            (!foundFirst && selectedKeys.indexOf(key) !== -1) ||
            (!foundFirst && !selectedKeys.length && firstActiveValue.indexOf(item.key) !== -1)
          ) {
            foundFirst = true;
            return React.cloneElement(item, {
              ref: (ref: HTMLDivElement) => {
                this.firstActiveItem = ref;
              },
            });
          }
          return item;
        };

        clonedMenuItems = menuItems.map((item: any) => {
          if (item.type.isMenuItemGroup) {
            const children = toArray(item.props.children).map(clone);
            return React.cloneElement(item, {}, children);
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
  };

  public render() {
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
