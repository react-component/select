'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DropdownMenu = require('./DropdownMenu');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _OptGroup = require('./OptGroup');

var _OptGroup2 = _interopRequireDefault(_OptGroup);

var _util = require('./util');

var _rcMenu = require('rc-menu');

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

var SelectTrigger = _react2['default'].createClass({
  displayName: 'SelectTrigger',

  propTypes: {
    dropdownMatchSelectWidth: _react.PropTypes.bool,
    visible: _react.PropTypes.bool,
    filterOption: _react.PropTypes.any,
    options: _react.PropTypes.any,
    prefixCls: _react.PropTypes.string,
    popupClassName: _react.PropTypes.string,
    children: _react.PropTypes.any
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.props.dropdownMatchSelectWidth && this.props.visible) {
      var dropdownDOMNode = this.getPopupDOMNode();
      if (dropdownDOMNode) {
        dropdownDOMNode.style.width = _reactDom2['default'].findDOMNode(this).offsetWidth + 'px';
      }
    }
  },

  getInnerMenu: function getInnerMenu() {
    return this.popupMenu && this.popupMenu.refs.menu;
  },

  getPopupDOMNode: function getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  },

  getDropdownElement: function getDropdownElement(newProps) {
    var props = this.props;
    return _react2['default'].createElement(_DropdownMenu2['default'], _extends({
      ref: this.saveMenu
    }, newProps, {
      prefixCls: this.getDropdownPrefixCls(),
      onMenuSelect: props.onMenuSelect,
      onMenuDeselect: props.onMenuDeselect,
      value: props.value,
      defaultActiveFirstOption: props.defaultActiveFirstOption,
      dropdownMenuStyle: props.dropdownMenuStyle
    }));
  },

  getDropdownTransitionName: function getDropdownTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = this.getDropdownPrefixCls() + '-' + props.animation;
    }
    return transitionName;
  },

  getDropdownPrefixCls: function getDropdownPrefixCls() {
    return this.props.prefixCls + '-dropdown';
  },

  filterOption: function filterOption(input, child) {
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
  },

  saveMenu: function saveMenu(menu) {
    this.popupMenu = menu;
  },

  renderFilterOptions: function renderFilterOptions() {
    return this.renderFilterOptionsFromChildren(this.props.options, true);
  },

  renderFilterOptionsFromChildren: function renderFilterOptionsFromChildren(children, showNotFound) {
    var _this = this;

    var sel = [];
    var props = this.props;
    var inputValue = props.inputValue;
    var childrenKeys = [];
    var tags = props.tags;
    _react2['default'].Children.forEach(children, function (child) {
      if (child.type === _OptGroup2['default']) {
        var innerItems = _this.renderFilterOptionsFromChildren(child.props.children, false);
        if (innerItems.length) {
          var label = child.props.label;
          var key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          sel.push(_react2['default'].createElement(
            _rcMenu.ItemGroup,
            { key: key, title: label },
            innerItems
          ));
        }
        return;
      }
      var childValue = (0, _util.getValuePropValue)(child);
      if (_this.filterOption(inputValue, child)) {
        sel.push(_react2['default'].createElement(_rcMenu.Item, _extends({
          value: childValue,
          key: childValue
        }, child.props)));
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });
    if (tags) {
      // tags value must be string
      var value = props.value;
      value = value.filter(function (singleValue) {
        return childrenKeys.indexOf(singleValue) === -1 && (!inputValue || String(singleValue).indexOf(String(inputValue)) > -1);
      });
      sel = sel.concat(value.map(function (singleValue) {
        return _react2['default'].createElement(
          _rcMenu.Item,
          { value: singleValue, key: singleValue },
          singleValue
        );
      }));
      if (inputValue) {
        var notFindInputItem = sel.every(function (option) {
          return (0, _util.getValuePropValue)(option) !== inputValue;
        });
        if (notFindInputItem) {
          sel.unshift(_react2['default'].createElement(
            _rcMenu.Item,
            { value: inputValue, key: inputValue },
            inputValue
          ));
        }
      }
    }
    if (!sel.length && showNotFound && props.notFoundContent) {
      sel = [_react2['default'].createElement(
        _rcMenu.Item,
        { disabled: true, value: 'NOT_FOUND', key: 'NOT_FOUND' },
        props.notFoundContent
      )];
    }
    return sel;
  },

  render: function render() {
    var _popupClassName;

    var props = this.props;
    var multiple = props.multiple;
    var dropdownPrefixCls = this.getDropdownPrefixCls();
    var popupClassName = (_popupClassName = {}, _defineProperty(_popupClassName, props.dropdownClassName, !!props.dropdownClassName), _defineProperty(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
    var visible = props.visible;
    var menuItems = undefined;
    var search = undefined;
    menuItems = this.renderFilterOptions();
    search = multiple || props.combobox || !props.showSearch ? null : _react2['default'].createElement(
      'span',
      { className: dropdownPrefixCls + '-search' },
      props.inputElement
    );
    if (!search && !menuItems.length) {
      visible = false;
    }
    var popupElement = this.getDropdownElement({
      menuItems: menuItems,
      search: search,
      multiple: multiple,
      visible: visible
    });
    return _react2['default'].createElement(
      _rcTrigger2['default'],
      _extends({ action: props.disabled ? [] : ['click'],
        ref: 'trigger',
        getPopupContainer: props.getPopupContainer,
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        onPopupVisibleChange: props.onDropdownVisibleChange,
        popup: popupElement,
        popupVisible: visible,
        popupClassName: (0, _classnames2['default'])(popupClassName),
        popupStyle: props.dropdownStyle
      }, props),
      this.props.children
    );
  }
});

exports['default'] = SelectTrigger;
module.exports = exports['default'];