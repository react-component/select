webpackJsonp([6],{

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(243);


/***/ }),

/***/ 243:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);




/* eslint-disable */






var UserRemoteSelect = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(UserRemoteSelect, _React$Component);

  function UserRemoteSelect(props) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, UserRemoteSelect);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (UserRemoteSelect.__proto__ || Object.getPrototypeOf(UserRemoteSelect)).call(this, props));

    _this.state = {
      data: [],
      value: [],
      fetching: false
    };

    _this.fetchUser = function (value) {
      console.log('fetching user1', value);
      _this.lastFetchId += 1;
      var fetchId = _this.lastFetchId;
      _this.setState({ data: [], fetching: true });

      var data = [1, 2, 3, 4, 5, 6].map(function (user, index) {
        return {
          text: index + 'label',
          value: '' + index
        };
      });
      // 模拟：选中的时候，目标数据不在结果集中
      if (!value) {
        data.shift();
      }
      _this.setState({ data: data, fetching: false });
    };

    _this.handleChange = function (value) {
      console.log('onchange', value);
      _this.setState({
        value: value,
        data: [],
        fetching: false
      });
    };

    _this.lastFetchId = 0;
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(UserRemoteSelect, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          fetching = _state.fetching,
          data = _state.data,
          value = _state.value;

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_rc_select___default.a,
        {
          showSearch: true,
          labelInValue: true,
          value: value,
          placeholder: 'Select users',
          optionFilterProp: 'children',
          notFoundContent: fetching ? __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Spin, { size: 'small' }) : null,
          onSearch: this.fetchUser,
          onChange: this.handleChange,
          style: { width: '100%' }
        },
        data.map(function (d) {
          return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5_rc_select__["Option"],
            { key: d.value },
            d.text
          );
        })
      );
    }
  }]);

  return UserRemoteSelect;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(UserRemoteSelect, null), document.getElementById('__react-content'));

/* eslint-enable */

/***/ })

},[242]);
//# sourceMappingURL=~debug.1.js.map