import React from 'react';
import ReactDOM from 'react-dom';
import {getValuePropValue} from './util';
import {Item as MenuItem, ItemGroup as MenuItemGroup} from 'rc-menu';
import OptGroup from './OptGroup';
import {classSet} from 'rc-util';
import Panel from './DropdownPanel';
import Align from 'rc-align';
import Animate from 'rc-animate';

function isBelow(align) {
  const points = align.points;
  if (points[0] === 'tl' && points[1] === 'bl') {
    return true;
  }
  return false;
}

const ALIGN = {
  points: ['tl', 'bl'],
  offset: [0, 4],
  overflow: {
    adjustX: 0,
    adjustY: 1,
  },
};

const SelectDropdown = React.createClass({
  propTypes: {
    filterOption: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
    visible: React.PropTypes.bool,
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
  },

  componentDidMount() {
    this.nativeDOMNode = ReactDOM.findDOMNode(this);
  },

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  },

  onAlign(node, align) {
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const belowClassName = `${dropdownPrefixCls}--below`;
    const topClassName = `${dropdownPrefixCls}--top`;
    const className = node.className;
    const hasBelowClassName = className.indexOf(belowClassName);
    const isBelowAlign = isBelow(align);
    if (!isBelowAlign && hasBelowClassName) {
      node.className = node.className.replace(belowClassName, topClassName);
    }
  },

  getDropdownPrefixCls() {
    return this.props.prefixCls + '-dropdown';
  },

  getMenuComponent() {
    return this.refs.panel.refs.menu;
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

  renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.children, true);
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const menuItems = this.renderFilterOptions();
    let visible = props.visible;
    const search = props.isMultipleOrTagsOrCombobox || !props.showSearch ? null :
      (<span className={`${prefixCls}-search ${prefixCls}-search--dropdown`}>{props.inputElement}</span>);
    if (!search && !menuItems.length) {
      visible = false;
    }
    const hiddenClass = `${dropdownPrefixCls}-hidden`;
    let className = classSet({
      [dropdownPrefixCls]: 1,
      [`${dropdownPrefixCls}--below`]: 1,
      [hiddenClass]: !visible,
      [props.className]: !!props.className,
      [`${dropdownPrefixCls}--${props.isMultipleOrTags ? 'multiple' : 'single'}`]: 1,
    });
    const domNode = this.nativeDOMNode;
    if (!visible && domNode) {
      // keep adjusted className
      className = domNode.className;
      if (className.indexOf(hiddenClass) === -1) {
        className += ' ' + hiddenClass;
      }
    }
    // single and not combobox, input is inside dropdown
    return (
      <Animate
        component=""
        exclusive
        transitionAppear
        showProp="selectOpen"
        transitionName={props.transitionName}>
        <Align target={props.getAlignTarget}
               key="dropdown"
               onAlign={this.onAlign}
               selectOpen={visible}
               disabled={!visible}
               align={ALIGN}>
          <div key="dropdown"
               onFocus={props.onDropdownFocus}
               onBlur={props.onDropdownBlur}
               style={props.dropdownStyle}
               className={className}
               tabIndex="-1">
            <Panel ref="panel" {...props} menuItems={menuItems} visible={visible} search={search}/>
          </div>
        </Align>
      </Animate>);
  },
});

export default SelectDropdown;
