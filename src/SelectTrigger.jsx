import Trigger from 'rc-trigger';
import React, {PropTypes} from 'react';
import {classSet} from 'rc-util';
import DropdownMenu from './DropdownMenu';
import ReactDOM from 'react-dom';
import OptGroup from './OptGroup';
import {getValuePropValue} from './util';
import {Item as MenuItem, ItemGroup as MenuItemGroup} from 'rc-menu';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

const SelectTrigger = React.createClass({
  propTypes: {
    dropdownMatchSelectWidth: PropTypes.bool,
    visible: PropTypes.bool,
    filterOption: PropTypes.any,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    children: PropTypes.any,
  },

  componentDidUpdate() {
    if (this.props.dropdownMatchSelectWidth && this.props.visible) {
      const dropdownDOMNode = this.getPopupDOMNode();
      if (dropdownDOMNode) {
        dropdownDOMNode.style.width = ReactDOM.findDOMNode(this).offsetWidth + 'px';
      }
    }
  },

  getInnerMenu() {
    return this.popupMenu && this.popupMenu.refs.menu;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  },

  getDropdownElement(newProps) {
    const props = this.props;
    return (<DropdownMenu
      ref={this.saveMenu}
      {...newProps}
      prefixCls={this.getDropdownPrefixCls()}
      onMenuSelect={props.onMenuSelect}
      onMenuDeselect={props.onMenuDeselect}
      value={props.value}
      dropdownMenuStyle={props.dropdownMenuStyle}
    />);
  },

  getDropdownTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  },

  getDropdownPrefixCls() {
    return `${this.props.prefixCls}-dropdown`;
  },

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
  },

  saveMenu(menu) {
    this.popupMenu = menu;
  },

  renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.options, true);
  },

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
      value = value.filter((singleValue)=> {
        return childrenKeys.indexOf(singleValue) === -1 && (!inputValue || singleValue.indexOf(inputValue) > -1);
      });
      sel = sel.concat(value.map((singleValue)=> {
        return <MenuItem value={singleValue} key={singleValue}>{singleValue}</MenuItem>;
      }));
      if (inputValue) {
        const notFindInputItem = sel.every((option)=> {
          return getValuePropValue(option) !== inputValue;
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
  },

  render() {
    const props = this.props;
    const multiple = props.multiple;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    let visible = props.visible;
    let menuItems;
    let search;
    menuItems = this.renderFilterOptions();
    search = multiple || props.combobox || !props.showSearch ? null : (
      <span className={`${dropdownPrefixCls}-search`}>{props.inputElement}</span>
    );
    if (!search && !menuItems.length) {
      visible = false;
    }
    return (<Trigger action={['click']}
                    ref="trigger"
                    popupPlacement="bottomLeft"
                    builtinPlacements={BUILT_IN_PLACEMENTS}
                    prefixCls={dropdownPrefixCls}
                    popupTransitionName={this.getDropdownTransitionName()}
                    onPopupVisibleChange={props.onDropdownVisibleChange}
                    popup={this.getDropdownElement({
                      menuItems, search, multiple, visible,
                    })}
                    popupVisible={visible}
                    popupClassName={classSet(popupClassName)}
                    popupStyle={props.dropdownStyle}
    >{this.props.children}</Trigger>);
  },
});

export default SelectTrigger;
