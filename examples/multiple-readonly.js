webpackJsonp([13],{

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(223);


/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_select__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_select__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);




/* eslint no-console: 0 */





var children = [];
for (var i = 10; i < 36; i++) {
  // 11 => readonly selected item
  children.push(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_5_rc_select__["Option"],
    { disabled: i === 11, key: i.toString(36) + i },
    '\u4E2D\u6587',
    i
  ));
}

var Test = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Test, _React$Component);

  function Test() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Test.__proto__ || Object.getPrototypeOf(Test)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: ['b11']
    }, _this.onChange = function (value) {
      console.log('onChange', value);
      _this.setState({ value: value });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Test, [{
    key: 'render',
    value: function render() {
      var dropdownMenuStyle = {
        maxHeight: 200
      };
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'h2',
          null,
          'multiple readonly default selected item'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'div',
          { style: { width: 300 } },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5_rc_select___default.a,
            {
              multiple: true,
              value: this.state.value,
              animation: 'slide-up',
              choiceTransitionName: 'rc-select-selection__choice-zoom',
              dropdownMenuStyle: dropdownMenuStyle,
              style: { width: 500 },
              optionFilterProp: 'children',
              optionLabelProp: 'children',
              placeholder: 'please select',
              onChange: this.onChange
            },
            children
          )
        )
      );
    }
  }]);

  return Test;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ })

},[222]);
//# sourceMappingURL=multiple-readonly.js.map