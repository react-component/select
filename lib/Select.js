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
    multiple: React.PropTypes.bool
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
    var children = this.props.children;
    this.initialChildren = children;

    return {
      selectedOptions: this._getDefaultSelected(children),
      inputVal: ''
    };
  },

  handleClick: function (e) {
    this.setOpenState(!this.state.open, function () {
      this.refs.search.getDOMNode().focus()
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
  },

  handleSearch: function (e) {
    var val = e.target.value;
    this.setState({inputVal: val});

    var children;

    //for performance
    if (val.length > this.state.inputVal.length) {
      children = this.props.children;
    } else {
      children = this.initialChildren;
    }

    // change children
    this.props.children = this._getFilterList(children, val);
  },

  _getFilterList: function (children, searchText) {
    var sel = [];
    React.Children.forEach(children, function (child) {
      var cc = child.props.children;
      if (React.isValidElement(child) && typeof cc === 'string' && cc.indexOf(searchText) > -1) {
        sel.push(child);
      }
    });

    if (!sel.length) {
      sel.push(<MenuItem disabled>No results found</MenuItem>)
    }

    return sel;
  },

  _getDefaultSelected: function (children) {
    var sel = [];
    React.Children.forEach(children, function (child) {
      var cc = child.props.children;
      if (React.isValidElement(child) && typeof cc === 'string' && child.props.selected) {
        //sel.push(cc);
        sel.push(child);
      }
    });
    if (!this.props.multiple) {
      sel = [sel.pop()];
    }
    return sel;
  },

  optionSelected: function (key, item) {
    var sel = [];
    if (this.props.multiple) {
      sel = this.state.selectedOptions;
    }
    //sel.push(item.props.children);
    sel.push(item);
    this.setState({ selectedOptions: sel });

    //close menu, reset input and children
    this.setOpenState(false);
    this.setState({inputVal: ''});
    this.props.children = this.initialChildren;
  },

  optionDeSelect: function (key, item) {
    var sel = this.state.selectedOptions.filter(function (option) {
      return option.props.value !== item.props.value;
    });
    this.setState({ selectedOptions: sel });
  },

  removeSelected: function (e, arg) {
    console.log( e, arg );
    this.optionDeSelect(item.props.value, item)
  },

  render: function () {
    var props = this.props;
    var rootPrefixCls = props.prefixCls;

    var rootCls = {};
    rootCls[rootPrefixCls] = true;
    rootCls[rootPrefixCls + '-container'] = true;

    if (this.state.open) {
      rootCls[this._getOpenClassName()] = true;
    }

    var multiple = props.multiple;

    var ctrlNode;
    var input = (
      <input
          ref="search"
          onChange={this.handleSearch}
          onKeyDown={this.handleInputKeyDown}
          value={this.state.inputVal}
          className="select-search__field"
          type="search" tabIndex="0" role="textbox" />
    );

    var lis, selOpts = this.state.selectedOptions;
    var selectedKeys = [];
    var menuProps = {
      onSelect: this.optionSelected
    };

    if (multiple) {
      menuProps.multiple = true;
      menuProps.onDeselect = this.optionDeSelect;
      lis = selOpts.map(function (item) {
        selectedKeys.push(item.props.value);
        return (
          <li className="select-selection__choice">
            <span className="select-selection__choice__remove"
                onClick={this.removeSelected}
                role="presentation">×</span>
           {item.props.children}
          </li>
        );
      });
      ctrlNode = (
        <ul className="select-selection__rendered">
          {lis}
          <li className="select-search select-search--inline">{input}</li>
        </ul>
      );

    } else {
      var oneSel = selOpts[selOpts.length - 1];
      selectedKeys.push(oneSel.props.value);
      ctrlNode = (
        <span className="select-selection__rendered">
          {oneSel.props.children}
        </span>
      );
    }
    menuProps.selectedKeys = selectedKeys;

    return (
      <span ref="container" className={joinClasses(props.className, classSet(rootCls))} dir="ltr">

        <span className={joinClasses('select-selection',
            'select-selection--' + (multiple ? 'multiple' : 'single'))}
            tabIndex="0"
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            role="combobox" aria-autocomplete="list" aria-haspopup="true"
            aria-expanded={this.state.open} aria-owns="">
          {ctrlNode}
          {multiple ? '' : <span className="select-arrow" role="presentation"><b role="presentation"></b></span>}
        </span>

        <span className="dropdown-wrapper" aria-hidden={!this.state.open}>
          <span className="select-dropdown select-dropdown--below">
            {multiple ? '' : <span className="select-search select-search--dropdown">{input}</span>}
            <Menu
                {...menuProps}
                ref="menu" activeFirst
                className="select-menu">
              {util.mapValidComponents(this.props.children, this.renderOption)}
            </Menu>
          </span>
        </span>
      </span>
    );
  },

  renderOption: function (child, index) {
    var props = child.props;

    if (props.selected) {
      props.active = true;
    }

    //child.key = props.value; // key is immutable in here
    props.eventKey = props.value;

    return <MenuItem className="select-menu-item" {...props}>{child.props.children}</MenuItem>
  },

  componentDidMount: function () {
    //console.log( 'm' );
  }
});
module.exports = Select;