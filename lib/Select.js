/** @jsx React.DOM */

/**
 * Select
 */
var React = require('react');
var rcUtil = require('rc-util');
var joinClasses = rcUtil.joinClasses;
var classSet = rcUtil.classSet;
var KeyCode = rcUtil.KeyCode;
var Menu = require('rc-menu');
var MenuItem = Menu.Item;

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

function getPropsFromOption(child) {
  var ret = {
    key: getValueFromOptionChild(child),
    value: getValueFromOptionChild(child)
  };
  var optionProps = child.props;
  for (var i in optionProps) {
    if (i !== 'children') {
      ret[i] = optionProps[i];
    }
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

  renderFilterOptions() {
    var inputValue = this.state.inputValue;
    var sel = [];
    var props = this.props;
    var childrenKeys = [];
    var filterOption = props.filterOption;
    var tags = props.tags;
    React.Children.forEach(props.children, (child)=> {
      if (!filterOption || !inputValue || !child.props.disabled && getValueFromOptionChild(child).indexOf(inputValue) > -1) {
        sel.push(child);
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
        return <MenuItem value={v}>{v}</MenuItem>;
      }));
      if (inputValue) {
        var notFindInputItem = sel.every((s)=> {
          return getValueFromOptionChild(s) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(<MenuItem value={inputValue}>{inputValue}</MenuItem>);
        }
      }
    }
    if (!sel.length) {
      sel = <MenuItem disabled value='NOT_FOUND'>{props.notFoundContent}</MenuItem>;
    }
    return sel;
  }

  setOpenState(open) {
    this.setState({
      open: open
    }, ()=> {
      if (open || isMultipleOrTags(this.props) || this.props.combobox) {
        this.refs.input.getDOMNode().focus();
      } else {
        this.refs.selection.getDOMNode().focus();
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
    this.setOpenState(!this.state.open);
  }

  // combobox ignore
  handleKeyDown(e) {
    var keyCode = e.keyCode;
    if (keyCode === KeyCode.ENTER || e.keyCode === KeyCode.DOWN) {
      this.handleClick(e);
      e.preventDefault();
    }
  }

  handleInputKeyDown(e) {
    if (e.keyCode === KeyCode.DOWN) {
      if (!this.state.open) {
        this.setState({
          open: true
        });
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
    if (this.refs.menu) {
      if (this.refs.menu.handleKeyDown(e)) {
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

  renderMenu(children) {
    var props = this.props;
    var menuProps = {};
    if (isMultipleOrTags(props)) {
      menuProps.onDeselect = this.handleMenuDeselect;
    }
    var value = this.state.value;
    var menuItems = React.Children.map(children, this.renderOption);
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
            <span className={prefixCls + '-selection__choice__remove'}
              onClick={this.removeSelected.bind(this, v)}
            >×</span>
           {v}
          </li>
        );
      });
    }
    return (
      <ul className={prefixCls + '-selection__rendered'}>
          {selectedValueNodes}
          {allowClear && !isMultipleOrTags(props) ? clear : null}
        <li className={joinClasses(prefixCls + '-search', prefixCls + '-search--inline')}>{input}</li>
      </ul>
    );
  }

  renderRoot(children) {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var rootCls = {};
    rootCls[prefixCls] = true;
    if (this.state.open) {
      rootCls[prefixCls + '-open'] = true;
    }
    return (
      <span className={joinClasses(props.className, classSet(rootCls))} dir="ltr"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}>
        {children}
      </span>
    );
  }

  renderOption(child) {
    var props = getPropsFromOption(child);
    return <MenuItem {...props}>{child.props.children}</MenuItem>;
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
        className={prefixCls + '-search__field'}
        role="textbox" />
    );

    var children = this.renderFilterOptions();
    var ctrlNode = this.renderTopControlNode(input);
    var dropDown;
    if (state.open) {
      // single and not combobox, input is inside dropdown
      dropDown = <span key="dropdown" className= {joinClasses(prefixCls + '-dropdown', prefixCls + '-dropdown--below')} tabIndex="-1">
      {multiple || props.combobox ? null : <span className={joinClasses(prefixCls + '-search', prefixCls + '-search--dropdown')}>{input}</span>}
        {this.renderMenu(children)}
      </span>;
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
        {multiple ? null :
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
  tags: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onDeselect: React.PropTypes.func
};

Select.defaultProps = {
  prefixCls: 'rc-select',
  filterOption: true,
  allowClear: true,
  onChange: noop,
  onSelect: noop,
  onDeselect: noop,
  notFoundContent: 'Not Found'
};

module.exports = Select;
