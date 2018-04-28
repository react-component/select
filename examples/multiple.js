webpackJsonp([12],{

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(214);


/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_select__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_select__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_select_assets_index_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);



/* eslint no-console: 0 */






var children = [];
for (var i = 10; i < 36; i++) {
  children.push(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_4_rc_select__["Option"],
    { key: i.toString(36) + i, disabled: i === 10, title: '\u4E2D\u6587' + i },
    '\u4E2D\u6587',
    i
  ));
}

var Test = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Test, _React$Component);

  function Test() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Test.prototype.render = function render() {
    var dropdownMenuStyle = {
      maxHeight: 200
    };
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'h2',
        null,
        'multiple select\uFF08scroll the menu\uFF09'
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'p',
        null,
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          'label',
          null,
          'anim',
          __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', { checked: this.state.useAnim, type: 'checkbox', onChange: this.useAnim })
        )
      ),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'div',
        { style: { width: 300 } },
        __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_4_rc_select___default.a,
          {
            value: this.state.value,
            animation: this.state.useAnim ? 'slide-up' : null,
            choiceTransitionName: 'rc-select-selection__choice-zoom',
            dropdownMenuStyle: dropdownMenuStyle,
            style: { width: 500 },
            multiple: true,
            allowClear: true,
            optionFilterProp: 'children',
            optionLabelProp: 'children',
            onSelect: this.onSelect,
            onDeselect: this.onDeselect,
            placeholder: 'please select',
            onChange: this.onChange,
            onFocus: function onFocus() {
              return console.log('focus');
            },
            tokenSeparators: [' ', ',']
          },
          children
        )
      )
    );
  };

  return Test;
}(__WEBPACK_IMPORTED_MODULE_3_react___default.a.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    useAnim: 0,
    value: ['a10']
  };

  this.onChange = function (value, options) {
    console.log('onChange', value, options);
    _this2.setState({
      value: value
    });
  };

  this.onSelect = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    console.log(args);
  };

  this.onDeselect = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    console.log(args);
  };

  this.useAnim = function (e) {
    _this2.setState({
      useAnim: e.target.checked
    });
  };
};

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ })

},[213]);
//# sourceMappingURL=multiple.js.map