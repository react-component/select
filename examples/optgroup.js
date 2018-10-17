webpackJsonp([11],{

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(227);


/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_select__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rc_select__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_select_assets_index_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rc_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
/* eslint no-console: 0 */






function onChange(value, option) {
  console.log('selected ' + value, option);
}

var c1 = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'Select OptGroup'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    { style: { width: 300 } },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_rc_select___default.a,
      {
        placeholder: 'placeholder',
        defaultValue: 'lucy',
        showSearch: false,
        style: { width: 500 },
        onChange: onChange
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_1_rc_select__["OptGroup"],
        { label: 'manager' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_rc_select__["Option"],
          { value: 'jack', 'test-prop': 'jack-prop' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'b',
            {
              style: {
                color: 'red'
              }
            },
            'jack'
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_rc_select__["Option"],
          { value: 'lucy', 'test-prop': 'lucy-prop' },
          'lucy'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_1_rc_select__["OptGroup"],
        { label: 'engineer' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_rc_select__["Option"],
          { value: 'yiminghe', 'test-prop': 'yiminghe-prop' },
          'yiminghe'
        )
      )
    )
  )
);

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(c1, document.getElementById('__react-content'));

/***/ })

},[226]);
//# sourceMappingURL=optgroup.js.map