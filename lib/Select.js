/** @jsx React.DOM */

/**
*Select
*/
var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var util = require('./utils/util');
var KeyCode = util.KeyCode;

var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

var Select = React.createClass({
  propTypes: {
    multiple: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onDeselect: React.PropTypes.func
  },
  mixins: [require('./OpenStateMixin')],

  getDefaultProps: function () {
    return {
      prefixCls: 'select'
    };
  },

  _getOpenClassName: function () {
    return this.props.openClassName || this.props.prefixCls + '-open';
  },

  getInitialState: function () {
    var props = this.props;

    this.initialChildren = props.children;

    //handle select value attribute
    var selectValue = props.value;
    if (typeof selectValue === 'string') {
      selectValue = [selectValue];
    }

    var selectedOptions = this._getDefaultSelected(props.children, selectValue);
    if (!props.multiple && selectedOptions.length) {
      selectedOptions = [selectedOptions.pop()];
    }
    // set the last selected option active
    selectedOptions.length && (selectedOptions[selectedOptions.length - 1].props.active = true);

    return {
      selectedOptions: this._setMaxSelectionLength(selectedOptions),
      inputVal: ''
    };
  },

  _getDefaultSelected: function (children, selectValue) {
    var sel = [];
    React.Children.forEach(children, function (child) {
      if (React.isValidElement(child) &&
          //(selectValue && selectValue.indexOf(child.props.value) > -1 || child.props.selected)) {
          (selectValue && selectValue.indexOf(child.props.value) > -1)) {
        sel.push(child);
      }
    });
    return sel;
  },

  _setMaxSelectionLength: function (sel) {
    var maxLen = this.props.maximumSelectionLength;
    if (maxLen && sel.length > maxLen) {
      sel = sel.slice(0, maxLen);
    }
    return sel;
  },

  _resetSelect: function () {
    // reset input and children when close menu
    if (this.props.__combobox) {
      var selOpts = this.state.selectedOptions, len = selOpts.length;
      console.log( len && selOpts[len - 1].props.value, this.state.inputVal );
      len && this.setState({ inputVal: selOpts[len - 1].props.value });
    } else {
      this.setState({ inputVal: ''});
    }
    this.props.children = this.initialChildren;
  },

  _getFilterList: function (children, searchText) {
    var sel = [];
    React.Children.forEach(children, function (child) {
      // option content can be string or html element
      var cc = child.props.value;
      if (React.isValidElement(child) &&
          !child.props.__no_results &&
          cc.indexOf(searchText) > -1) {
        sel.push(child);
      }
    });
    return sel;
  },

  handleSearch: function (e) {
    var val = e.target.value;
    this.setState({inputVal: val});

    var children;

    //for performance
    if (val.length && val.length > this.state.inputVal.length) {
      children = this.props.children;
    } else {
      children = this.initialChildren;
    }

    this.filterList = this._getFilterList(children, val);

    // change children
    if (this.filterList.length) {
      this.props.children = this.filterList;
    } else {
      console.log( 'xx' );
      //this.clearSelection();
      this.props.children = this.props.__combobox ? '' :
          <MenuItem disabled __no_results>No results found</MenuItem>;
    }
  },

  handleClick: function (e) {
    var open = this.state.open;
    this.setOpenState(!open, function () {
      if (!open) {
        this.refs.search.getDOMNode().focus();
      } else {
        this.refs.selection.getDOMNode().focus();
      }
    });
  },

  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    if (keyCode !== KeyCode.ENTER) {
      return;
    }
    this.handleClick(e);
  },

  handleInputKeyDown: function (e) {
    this.refs.menu.handleKeyDown(e);

    // input keyDown event will bubble up when select is multiple,
    // so it will fire handleKeyDown automatically.
    if (!this.props.multiple) {
      this.handleKeyDown(e);
    } else {
      var selOpts = this.state.selectedOptions;
      if (KeyCode.Backspace === e.keyCode && selOpts.length) {
        selOpts.pop();
        this.setState({ selectedOptions: selOpts });
      }
    }
  },

  optionSelected: function (key, item) {
    var sel = [];
    if (this.props.onSelect) {
      this.props.onSelect(key, item);
    }
    if (this.props.multiple) {
      sel = this.state.selectedOptions;
    }
    sel.push(item);
    this.setState({ selectedOptions: this._setMaxSelectionLength(sel) });
    this.setOpenState(!this.state.open);
  },

  optionDeSelect: function (key, item) {
    var sel = this.state.selectedOptions.filter(function (option) {
      return option.props.value !== item.props.value;
    });
    this.setState({ selectedOptions: sel });

    if (this.props.onDeselect) {
      this.props.onDeselect(key, item);
    }
  },

  removeSelected: function (item) {
    this.optionDeSelect(item.props.value, item);
  },

  clearSelection: function () {
    this.setState({ selectedOptions: [] });
  },

  setMenuProps: function (multiple, props, selection) {
    var menuProps = {
      onSelect: this.optionSelected
    };

    if (multiple) {
      menuProps.multiple = true;
      menuProps.onDeselect = this.optionDeSelect;
    }
    var selectedKeys = selection.selectedKeys;
    menuProps.selectedKeys = selectedKeys;
    menuProps.activeKey = selectedKeys.length ? selectedKeys[selectedKeys.length - 1] : '';

    if (!util.toArray(props.children).some(function (item) {
      if (item.props) {
        return item.props.value === menuProps.activeKey;
      }
    })) {
      menuProps.activeKey = null;
    }
    return menuProps;
  },

  render: function () {
    var props = this.props;
    var multiple = props.multiple;

    var input = (
      <input ref="search"
          onChange={this.handleSearch}
          onKeyDown={this.handleInputKeyDown}
          value={this.state.inputVal}
          className="select-search__field"
          type="search" tabIndex="0" role="textbox" />
    );

    var selection = this.renderSelection(multiple, input);
    var menuProps = this.setMenuProps(multiple, props, selection);

    return this.renderContainer(props, [
      <span ref="selection"
          className={joinClasses('select-selection',
            'select-selection--' + (multiple ? 'multiple' : 'single'))}
          tabIndex="0"
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          role="combobox" aria-autocomplete="list" aria-haspopup="true"
          aria-expanded={this.state.open} aria-owns="">
        {selection.ctrlNode}
        {multiple ? '' :
            <span className="select-arrow" role="presentation"><b role="presentation"></b></span>}
      </span>,
      <span className="select-dropdown select-dropdown--below" aria-hidden={!this.state.open}>
        {multiple ? '' : <span className="select-search select-search--dropdown">{input}</span>}
        <Menu ref="menu" activeFirst
            {...menuProps}
            className="select-menu">
          {util.mapValidComponents(this.props.children, this.renderOption)}
        </Menu>
      </span>
    ]);
  },

  renderSelection: function (multiple, input) {
    var lis, selOpts = this.state.selectedOptions;
    var selectedKeys = [];

    var allowClear = this.props.allowClear;
    var clear = <span className="select-selection__clear" onClick={this.clearSelection}>×</span>;

    if (multiple) {
      lis = selOpts.map(function (item) {
        selectedKeys.push(item.props.value);
        return (
          <li className="select-selection__choice">
            <span className="select-selection__choice__remove"
                onClick={this.removeSelected.bind(this, item)}
                role="presentation">×</span>
           {item.props.value}
          </li>
        );
      }, this);

      ctrlNode = (
        <ul className="select-selection__rendered">
          {this.props.__combobox ? '' : lis}
          {allowClear ? clear : ''}
          <li className="select-search select-search--inline">{input}</li>
        </ul>
      );
    } else {
      var sel = selOpts.length ? selOpts[selOpts.length - 1].props.value : '';
      selectedKeys.push(sel);
      ctrlNode = (
        <span className="select-selection__rendered">
          {sel}
          {allowClear ? clear : ''}
        </span>
      );
    }

    return {
      ctrlNode: ctrlNode,
      selectedKeys: selectedKeys
    };
  },

  renderContainer: function (props, children) {
    var rootPrefixCls = props.prefixCls;

    var rootCls = {};
    rootCls[rootPrefixCls] = true;
    rootCls[rootPrefixCls + '-container'] = true;

    if (this.state.open) {
      rootCls[this._getOpenClassName()] = true;
    }
    return (
      <span ref="container"
          className={joinClasses(props.className, classSet(rootCls))} dir="ltr">
        {children}
      </span>
    );
  },

  renderOption: function (child, index) {
    var props = child.props;

    //child.key = props.value; // key is immutable in here
    props.eventKey = props.value;

    return <MenuItem className="select-menu-item" {...props}
        dangerouslySetInnerHTML={{__html: child.props.children}}></MenuItem>
  }
});
module.exports = Select;