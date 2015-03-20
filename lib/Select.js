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

function noop() {
}

function getKeyFromOptionChild(child) {
  var optionProps = child.props;
  var children = optionProps.children;
  var ret = child.key || undefined;
  if (!ret) {
    if (typeof optionProps.value === 'string') {
      ret = optionProps.value;
    } else if (React.isValidElement(children)) {
      if (typeof children.props.children === 'string') {
        ret = children.props.children;
      }
    }
  }
  if (!ret && !child.props.disabled) {
    throw new Error('please set key on Option element!');
  }
  return ret;
}

function getPropsFromOption(child) {
  var ret = {
    key: getKeyFromOptionChild(child)
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

  _getFilterList(searchText) {
    var sel = [];
    React.Children.forEach(this.props.children, (child)=> {
      if (!searchText || !child.props.disabled && getKeyFromOptionChild(child).indexOf(searchText) > -1) {
        sel.push(child);
      }
    });
    return sel;
  }

  setOpenState(open) {
    this.setState({
      open: open
    }, ()=> {
      if (open || this.props.multiple || this.props.combobox) {
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
    if (this.props.multiple) {
      value = this.state.value.concat();
      value.push(item.props.value);
    } else {
      if (this.state.value[0] === item.props.value) {
        this.setOpenState(false);
        return;
      }
      value = [item.props.value];
    }
    this.props.onChange(this.props.multiple ? value : value[0]);
    this.setState({
      value: value,
      inputValue: ''
    });
    this.setOpenState(false);
    if (this.props.combobox) {
      this.setState({
        inputValue: value[0]
      });
    }
  }

  handleMenuDeselect() {
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

  removeSelected(value) {
    value = this.state.value.filter((v)=> {
      return v !== value;
    });
    this.props.onChange(this.props.multiple ? value : value[0]);
    this.setState({
      value: value
    });
  }

  handleClearSelection(e) {
    e.stopPropagation();
    if (this.state.value.length) {
      this.props.onChange(this.props.multiple ? [] : undefined);
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
    if (props.multiple) {
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
      multiple={props.multiple}
      focusable={false}
      {...menuProps}
      selectedKeys={selectedKeys}
      prefixCls={props.prefixCls + '-menu'}>
          {menuItems}
    </Menu>;
  }

  getTopControlNode(input) {
    var value = this.state.value;
    var prefixCls = this.props.prefixCls;
    var allowClear = this.props.allowClear;
    var clear = <span className={prefixCls + '-selection__clear'}
      onClick={this.handleClearSelection}>×</span>;
    var props = this.props;
    // single and not combobox, input is inside dropdown
    if (!props.combobox && !props.multiple) {
      return <span className={prefixCls + '-selection__rendered'}>
          {value[0]}
          {allowClear ? clear : null}
      </span>;
    }
    var selectedValueNodes;
    if (props.multiple) {
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
          {allowClear && !props.multiple ? clear : null}
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
    var multiple = props.multiple;
    var prefixCls = props.prefixCls;

    var input = (
      <input ref="input"
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        value={this.state.inputValue}
        className={prefixCls + '-search__field'}
        role="textbox" />
    );

    var children = this._getFilterList(this.state.inputValue);
    if (!children.length) {
      children = <MenuItem disabled>{props.notFoundContent}</MenuItem>;
    }

    var ctrlNode = this.getTopControlNode(input);
    var dropDown;
    if (this.state.open) {
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
        aria-expanded={this.state.open}
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
  onChange: React.PropTypes.func
};

Select.defaultProps = {
  prefixCls: 'rc-select',
  allowClear: true,
  onChange: noop,
  notFoundContent: 'Not Found'
};

module.exports = Select;
