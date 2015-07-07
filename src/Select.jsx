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

function isCombobox(props) {
  return props.combobox;
}

function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

function noop() {
}

function normValue(value) {
  if (value === undefined) {
    value = [];
  } else if (!Array.isArray(value)) {
    value = [value];
  }
  return value;
}

function filterFn(input, child) {
  return child.props[this.props.optionFilterProp].indexOf(input) > -1;
}

class Select extends React.Component {
  constructor(props) {
    super(props);
    var value = [];
    if ('value' in props) {
      value = normValue(props.value);
    } else if ('defaultValue' in props) {
      value = normValue(props.defaultValue);
    }
    this.state = {
      value: value,
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
    if ('value' in nextProps) {
      this.setState({
        value: normValue(nextProps.value)
      });
    }
  }

  fireChange(value) {
    this.props.onChange(isMultipleOrTags(this.props) ? value : value[0]);
    this.setState({
      value: value
    });
  }

  getLabelByValue(children, value) {
    if (value === undefined) {
      return value;
    }
    var label;
    React.Children.forEach(children, (c) => {
      if (c.type === OptGroup) {
        var maybe = this.getLabelByValue(c.props.children, value);
        if (maybe !== undefined) {
          label = maybe;
        }
      } else if (c.props.value === value) {
        label = c.props[this.props.optionLabelProp];
      }
    });
    return label;
  }

  filterOption(input, child) {
    if (!input) {
      return true;
    }
    var filterOption = this.props.filterOption;
    if (!filterOption) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterOption.call(this, input, child);
  }

  renderFilterOptionsFromChildren(children, showNotFound) {
    var inputValue = this.state.inputValue;
    var sel = [];
    var props = this.props;
    var childrenKeys = [];
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
      var childValue = child.props.value;
      if (typeof childValue !== 'string') {
        throw new Error('Option must set string value');
      }
      if (this.filterOption(inputValue, child)) {
        sel.push(<MenuItem
          value = {childValue}
          key = {childValue}
          {...child.props}
        />);
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });
    if (tags) {
      // tags value must be string
      var value = this.state.value;
      value = value.filter((v)=> {
        return childrenKeys.indexOf(v) === -1 && (!inputValue || v.indexOf(inputValue) > -1);
      });
      sel = sel.concat(value.map((v)=> {
        return <MenuItem value={v} key={v}>{v}</MenuItem>;
      }));
      if (inputValue) {
        var notFindInputItem = sel.every((s)=> {
          return s.props.value !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem value={inputValue} key={inputValue}>{inputValue}</MenuItem>);
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [<MenuItem disabled value='NOT_FOUND'>{props.notFoundContent}</MenuItem>];
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
      if (open || isMultipleOrTagsOrCombobox(this.props)) {
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
    var props = this.props;
    this.setState({
      inputValue: val,
      open: true
    });
    if (isCombobox(props)) {
      props.onChange(val);
    }
    props.onSearch(val);
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
    var props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  }

  // combobox ignore
  handleKeyDown(e) {
    var props = this.props;
    if (props.disabled) {
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
    if (isMultipleOrTags(this.props) && !e.target.value && e.keyCode === KeyCode.BACKSPACE) {
      var value = this.state.value.concat();
      if (value.length) {
        value.pop();
        this.fireChange(value);
      }
      return;
    }

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
    var value = this.state.value;
    var props = this.props;
    var selectedValue = item.props.value;
    if (isMultipleOrTags(props)) {
      value = value.concat([selectedValue]);
    } else {
      if (value[0] === selectedValue) {
        this.setOpenState(false);
        return;
      }
      value = [selectedValue];
    }
    props.onSelect(selectedValue, item);
    this.fireChange(value);
    this.setState({
      inputValue: ''
    });
    this.setOpenState(false);
    if (isCombobox(props)) {
      this.setState({
        inputValue: item.props[this.props.optionLabelProp]
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
    if (props.disabled) {
      return;
    }
    var value = this.state.value.filter((v)=> {
      return v !== selectedValue;
    });
    var canMultiple = isMultipleOrTags(props);
    if (canMultiple) {
      props.onDeselect(selectedValue);
    }
    this.fireChange(value);
  }

  handleClearSelection(e) {
    var props = this.props;
    var state = this.state;
    if (props.disabled) {
      return;
    }
    e.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setState({
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
      if (value.indexOf(item.props.value) !== -1 && item.key) {
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
    var props = this.props;
    var prefixCls = props.prefixCls;
    var allowClear = props.allowClear;
    var children = props.children;
    var clear = <span className={prefixCls + '-selection__clear'}
      onClick={this.handleClearSelection}>×</span>;
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      return (<span className={prefixCls + '-selection__rendered'}>
        <span>{this.getLabelByValue(children, value[0]) || props.placeholder}</span>
          {allowClear ? clear : null}
      </span>);
    }
    var selectedValueNodes;
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((v) => {
        var content = this.getLabelByValue(children, v) || v;
        var title = content;
        var maxTagTextLength = props.maxTagTextLength;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = content.slice(0, maxTagTextLength) + '...';
        }
        return (
          <li className={prefixCls + '-selection__choice'} title={title}>
            <span className={prefixCls + '-selection__choice__content'}>{content}</span>
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
          {input}
        </li>
      </ul>
    );
  }

  renderRoot(children) {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var rootCls = {
      [prefixCls]: true,
      [prefixCls + '-open']: this.state.open,
      [prefixCls + '-combobox']: isCombobox(props),
      [prefixCls + '-disabled']: props.disabled
    };
    return (
      <span
        style={props.style}
        className={joinClasses(props.className, classSet(rootCls))}
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
        placeholder={props.searchPlaceholder}
        className={prefixCls + '-search__field'}
        role="textbox" />
    );

    var menuItems = this.renderFilterOptions();
    var ctrlNode = this.renderTopControlNode(input);
    var dropDown;
    if (state.open) {
      var search = isMultipleOrTagsOrCombobox(props) || !props.showSearch ? null :
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
    if (!isCombobox(props)) {
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
  filterOption: React.PropTypes.any,
  showSearch: React.PropTypes.bool,
  showArrow: React.PropTypes.bool,
  tags: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  optionLabelProp: React.PropTypes.string,
  optionFilterProp: React.PropTypes.string,
  animation: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  searchPlaceholder: React.PropTypes.string,
  placeholder: React.PropTypes.any,
  onDeselect: React.PropTypes.func,
  maxTagTextLength: React.PropTypes.number
};

Select.defaultProps = {
  prefixCls: 'rc-select',
  filterOption: filterFn,
  showSearch: true,
  allowClear: false,
  placeholder: '',
  searchPlaceholder: '',
  onChange: noop,
  onSelect: noop,
  onSearch: noop,
  onDeselect: noop,
  showArrow: true,
  optionFilterProp: 'value',
  optionLabelProp: 'value',
  notFoundContent: 'Not Found'
};

module.exports = Select;
