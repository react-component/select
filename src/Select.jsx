'use strict';

var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var KeyCode = rcUtil.KeyCode;
var Menu = require('rc-menu');
var MenuItem = Menu.Item;
var MenuItemGroup = Menu.ItemGroup;
var anim = require('css-animation');
var OptGroup = require('./OptGroup');

function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

function noop() {
}

function getValueFromOptionChild(child) {
  var optionProps = child.props;
  var children = optionProps.children;
  var ret;
  if (optionProps.value !== undefined) {
    if (typeof optionProps.value === 'string') {
      ret = optionProps.value;
    }
  } else if (typeof children === 'string') {
    ret = children;
  }
  if (!ret && !child.props.disabled) {
    throw new Error('must set value string on Option element!');
  }

  return ret;
}

function normValue(value) {
  if (value === undefined) {
    value = [];
  } else if (!Array.isArray(value)) {
    value = [value];
  }
  return value;
}

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: normValue(props.value),
      inputValue: ''
    };
    ['handleClick',
      'handleKeyDown',
      'handleInputKeyDown',
      'handleInputChange',
      'handleFocus',
      'handleBlur',
      'handleClearSelection',
      'handleMenuSelect',
      'handleMenuDeselect'].forEach((m)=> {
        this[m] = this[m].bind(this);
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: normValue(nextProps.value)
    });
  }

  renderFilterOptionsFromChildren(children, showNotFound) {
    var inputValue = this.state.inputValue;
    var sel = [];
    var props = this.props;
    var childrenKeys = [];
    var filterOption = props.filterOption;
    var tags = props.tags;
    React.Children.forEach(children, (child)=> {
      if (child.type === OptGroup) {
        var innerItems = this.renderFilterOptionsFromChildren(child.props.children, false);
        if (innerItems.length) {
          var label = child.props.label;
          var key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          }
          sel.push(<MenuItemGroup key={key} title={child.props.label}>
        {innerItems}
          </MenuItemGroup>);
        }
        return;
      }
      if (!filterOption || !inputValue || !child.props.disabled && getValueFromOptionChild(child).indexOf(inputValue) > -1) {
        sel.push(<MenuItem
          disabled={child.props.disabled}
          value={getValueFromOptionChild(child)}
          key={child.key || getValueFromOptionChild(child)}>
        {child.props.children}
        </MenuItem>);
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(getValueFromOptionChild(child));
      }
    });
    if (tags) {
      var value = this.state.value || [];
      value = value.filter((v)=> {
        return childrenKeys.indexOf(v) === -1 && (!inputValue || v.indexOf(inputValue) > -1);
      });
      sel = sel.concat(value.map((v)=> {
        return <MenuItem value={v} key={v}>{v}</MenuItem>;
      }));
      if (inputValue) {
        var notFindInputItem = sel.every((s)=> {
          return getValueFromOptionChild(s) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem value={inputValue} key={inputValue}>{inputValue}</MenuItem>);
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = <MenuItem disabled value='NOT_FOUND'>{props.notFoundContent}</MenuItem>;
    }
    return sel;
  }

  renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.children, true);
  }

  setOpenState(open) {
    var refs = this.refs;
    this.setState({
      open: open
    }, ()=> {
      if (open || isMultipleOrTags(this.props) || this.props.combobox) {
        if (refs.input) {
          React.findDOMNode(refs.input).focus();
        }
      } else if (refs.selection) {
        React.findDOMNode(refs.selection).focus();
      }
    });
  }

  handleInputChange(e) {
    var val = e.target.value;
    this.setState({
      inputValue: val,
      open: true
    });
    if (this.props.combobox) {
      this.setState({
        value: val ? [val] : []
      });
      this.props.onChange(val);
    }
  }

  handleClick() {
    if (!this.props.disabled) {
      if (this.state.open) {
        this.setOpenState(false);
      } else {
        this.openIfHasChildren();
      }
    }
  }

  openIfHasChildren() {
    if (React.Children.count(this.props.children)) {
      this.setOpenState(true);
    }
  }

  // combobox ignore
  handleKeyDown(e) {
    if (this.props.disabled) {
      return;
    }
    var keyCode = e.keyCode;
    if (this.state.open && !this.refs.input) {
      this.handleInputKeyDown(e);
    } else if (keyCode === KeyCode.ENTER || e.keyCode === KeyCode.DOWN) {
      this.handleClick();
      e.preventDefault();
    }
  }

  handleInputKeyDown(e) {
    if (e.keyCode === KeyCode.DOWN) {
      if (!this.state.open) {
        this.openIfHasChildren();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    } else if (e.keyCode === KeyCode.ESC) {
      if (this.state.open) {
        this.setOpenState(false);
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    var menu = this.refs.menu;
    if (menu) {
      if (menu.handleKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  handleMenuSelect(key, item) {
    var value;
    var props = this.props;
    var selectedValue = item.props.value;
    if (isMultipleOrTags(props)) {
      value = this.state.value.concat();
      value.push(selectedValue);
    } else {
      if (this.state.value[0] === selectedValue) {
        this.setOpenState(false);
        return;
      }
      value = [selectedValue];
    }
    props.onSelect(selectedValue);
    props.onChange(isMultipleOrTags(props) ? value : value[0]);
    this.setState({
      value: value,
      inputValue: ''
    });
    this.setOpenState(false);
    if (props.combobox) {
      this.setState({
        inputValue: value[0]
      });
    }
  }

  handleMenuDeselect(key, item, e) {
    if (e.type === 'click') {
      this.removeSelected(item.props.value);
    }
    this.setState({
      inputValue: ''
    });
    this.setOpenState(false);
  }

  handleBlur() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
    this._blurTimer = setTimeout(() => {
      this.setState({
        open: false
      });
    }, 100);
  }

  handleFocus() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
  }

  removeSelected(selectedValue) {
    var props = this.props;
    var value = this.state.value.filter((v)=> {
      return v !== selectedValue;
    });
    var canMultiple = isMultipleOrTags(props);
    if (canMultiple) {
      props.onDeselect(selectedValue);
    }
    props.onChange(isMultipleOrTags(props) ? value : value[0]);
    this.setState({
      value: value
    });
  }

  handleClearSelection(e) {
    if (this.props.disabled) {
      return;
    }
    e.stopPropagation();
    if (this.state.inputValue || this.state.value.length) {
      this.props.onChange(isMultipleOrTags(this.props) ? [] : undefined);
      this.setState({
        value: [],
        inputValue: ''
      });
    }
    this.setOpenState(false);
  }

  renderMenu(menuItems) {
    var props = this.props;
    var menuProps = {};
    if (isMultipleOrTags(props)) {
      menuProps.onDeselect = this.handleMenuDeselect;
    }
    var value = this.state.value;
    var selectedKeys = [];
    React.Children.forEach(menuItems, (item) => {
      if (value.indexOf(item.props.value) !== -1) {
        selectedKeys.push(item.key);
      }
    });
    var activeKey;
    if (selectedKeys.length === 1) {
      activeKey = selectedKeys[0];
    }
    return <Menu
      ref="menu"
      onSelect={this.handleMenuSelect}
      activeFirst={true}
      activeKey={activeKey}
      multiple={isMultipleOrTags(props)}
      focusable={false}
      {...menuProps}
      selectedKeys={selectedKeys}
      prefixCls={props.prefixCls + '-menu'}>
          {menuItems}
    </Menu>;
  }

  renderTopControlNode(input) {
    var value = this.state.value;
    var prefixCls = this.props.prefixCls;
    var allowClear = this.props.allowClear;
    var clear = <span className={prefixCls + '-selection__clear'}
      onClick={this.handleClearSelection}>×</span>;
    var props = this.props;
    // single and not combobox, input is inside dropdown
    if (!props.combobox && !isMultipleOrTags(props)) {
      return <span className={prefixCls + '-selection__rendered'}>
          {value[0]}
          {allowClear ? clear : null}
      </span>;
    }
    var selectedValueNodes;
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((v) => {
        return (
          <li className={prefixCls + '-selection__choice'}>
            {v}
            <span className={prefixCls + '-selection__choice__remove'}
              onClick={this.removeSelected.bind(this, v)}
            >×</span>
          </li>
        );
      });
    }
    return (
      <ul className={prefixCls + '-selection__rendered'}>
          {selectedValueNodes}
          {allowClear && !isMultipleOrTags(props) ? clear : null}
        <li className={joinClasses(prefixCls + '-search', prefixCls + '-search--inline')}>
          {input} {/*<i className="anticon anticon-search"></i>*/}</li>
      </ul>
    );
  }

  renderRoot(children) {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var rootCls = {
      [prefixCls]: true,
      [prefixCls + '-open']: this.state.open,
      [prefixCls + '-combobox']: props.combobox,
      [prefixCls + '-disabled']: props.disabled,
      [prefixCls + '-show-arrow']: props.showArrow
    };
    return (
      <span
        style={props.style}
        className={joinClasses(props.className, classSet(rootCls))}
        dir="ltr"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}>
        {children}
      </span>
    );
  }

  animateDropdown(prevProps, prevState) {
    var props = this.props;
    var state = this.state;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-dropdown-${props.animation}`;
    }
    if (transitionName && this.refs.dropdown) {
      var domNode = React.findDOMNode(this.refs.dropdown);
      if (state.open && !prevState.open) {
        anim(domNode, `${transitionName}-enter`);
      } else if (!state.open && prevState.open) {
        anim(domNode, `${transitionName}-leave`);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    prevState = prevState || {};
    this.animateDropdown(prevProps, prevState);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  render() {
    var props = this.props;
    var multiple = isMultipleOrTags(props);
    var state = this.state;
    var prefixCls = props.prefixCls;

    var input = (
      <input ref="input"
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        value={state.inputValue}
        disabled={props.disabled}
        className={prefixCls + '-search__field'}
        role="textbox" />
    );

    var menuItems = this.renderFilterOptions();
    var ctrlNode = this.renderTopControlNode(input);
    var dropDown;
    if (state.open) {
      var search = multiple || props.combobox || !props.showSearch ? null :
        <span className={joinClasses(prefixCls + '-search', prefixCls + '-search--dropdown')}>{input}</span>;
      if (!search && !menuItems.length) {
        this.cachedDropDown = dropDown = null;
      } else {
        // single and not combobox, input is inside dropdown
        this.cachedDropDown = dropDown = <span key="dropdown"
          ref="dropdown"
          className= {joinClasses(prefixCls + '-dropdown', prefixCls + '-dropdown--below')}
          tabIndex="-1">
        {search}
        {this.renderMenu(menuItems)}
        </span>;
      }
    } else {
      dropDown = this.cachedDropDown;
    }

    var extraSelectionProps = {};
    if (!props.combobox) {
      extraSelectionProps = {
        onKeyDown: this.handleKeyDown,
        tabIndex: 0
      };
    }

    return this.renderRoot([
      <span ref="selection"
        key="selection"
        className={joinClasses(prefixCls + '-selection',
          prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'))}
        role="combobox"
        aria-autocomplete="list"
        onClick={this.handleClick}
        aria-haspopup="true"
        aria-expanded={state.open}
      {...extraSelectionProps}
      >
        {ctrlNode}
        {multiple || !props.showArrow ? null :
          <span key="arrow" className={prefixCls + '-arrow'}>
            <b></b>
          </span>}
      </span>,
      dropDown
    ]);
  }
}

Select.propTypes = {
  multiple: React.PropTypes.bool,
  showSearch: React.PropTypes.bool,
  showArrow: React.PropTypes.bool,
  tags: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  animation: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onDeselect: React.PropTypes.func
};

Select.defaultProps = {
  prefixCls: 'rc-select',
  filterOption: true,
  showSearch: true,
  allowClear: false,
  onChange: noop,
  onSelect: noop,
  onDeselect: noop,
  showArrow: true,
  notFoundContent: 'Not Found'
};

module.exports = Select;
