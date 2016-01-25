'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _util = require('./util');

var _rcMenu = require('rc-menu');

var _rcMenu2 = _interopRequireDefault(_rcMenu);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var DropdownMenu = _react2['default'].createClass({
  displayName: 'DropdownMenu',

  propTypes: {
    prefixCls: _react2['default'].PropTypes.string,
    menuItems: _react2['default'].PropTypes.any,
    search: _react2['default'].PropTypes.any
  },

  componentDidMount: function componentDidMount() {
    this.scrollActiveItemToView();
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    // freeze when hide
    return nextProps.visible;
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    var props = this.props;
    if (!prevProps.visible && props.visible) {
      this.scrollActiveItemToView();
    }
  },

  scrollActiveItemToView: function scrollActiveItemToView() {
    // scroll into view
    var itemComponent = (0, _reactDom.findDOMNode)(this.firstActiveItem);
    if (itemComponent) {
      (0, _domScrollIntoView2['default'])(itemComponent, (0, _reactDom.findDOMNode)(this.refs.menu), {
        onlyScrollIfNeeded: true
      });
    }
  },

  renderMenu: function renderMenu() {
    var _this = this;

    var props = this.props;
    var menuItems = props.menuItems;
    var defaultActiveFirstOption = props.defaultActiveFirstOption;
    var value = props.value;
    var dropdownMenuStyle = props.dropdownMenuStyle;
    var prefixCls = props.prefixCls;
    var multiple = props.multiple;
    var onMenuDeselect = props.onMenuDeselect;
    var onMenuSelect = props.onMenuSelect;

    if (menuItems && menuItems.length) {
      var _ret = (function () {
        var menuProps = {};
        if (multiple) {
          menuProps.onDeselect = onMenuDeselect;
          menuProps.onSelect = onMenuSelect;
        } else {
          menuProps.onClick = onMenuSelect;
        }
        var selectedKeys = (0, _util.getSelectKeys)(menuItems, value);
        var activeKeyProps = {};

        var clonedMenuItems = menuItems;
        if (selectedKeys.length) {
          (function () {
            activeKeyProps.activeKey = selectedKeys[0];
            var foundFirst = false;
            // set firstActiveItem via cloning menus
            // for scroll into view
            var clone = function clone(item) {
              if (!foundFirst && selectedKeys.indexOf(item.key) !== -1) {
                foundFirst = true;
                return (0, _react.cloneElement)(item, {
                  ref: function ref(_ref) {
                    _this.firstActiveItem = _ref;
                  }
                });
              }
              return item;
            };

            clonedMenuItems = menuItems.map(function (item) {
              if (item.type === _rcMenu.ItemGroup) {
                var children = item.props.children.map(clone);
                return (0, _react.cloneElement)(item, {}, children);
              }
              return clone(item);
            });
          })();
        }

        return {
          v: _react2['default'].createElement(
            _rcMenu2['default'],
            _extends({
              ref: 'menu',
              defaultActiveFirst: defaultActiveFirstOption,
              style: dropdownMenuStyle
            }, activeKeyProps, {
              multiple: multiple,
              focusable: false
            }, menuProps, {
              selectedKeys: selectedKeys,
              prefixCls: prefixCls + '-menu' }),
            clonedMenuItems
          )
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    }
    return null;
  },

  render: function render() {
    return _react2['default'].createElement(
      'div',
      null,
      this.props.search,
      this.renderMenu()
    );
  }
});

exports['default'] = DropdownMenu;
module.exports = exports['default'];