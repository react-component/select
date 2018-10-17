webpackJsonp([9],{

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(231);


/***/ }),

/***/ 231:
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






function MultipleSelect() {
  var cases = {
    0: { name: 'Case 1' },
    1: { name: 'Case 2' },
    2: { name: 'Case 3' }
  };

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'h2',
      null,
      'Select optionLabelProp'
    ),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_rc_select___default.a,
      { style: { width: 500 }, optionLabelProp: 'children', multiple: true, allowClear: true },
      Object.keys(cases).map(function (key) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_rc_select__["Option"],
          { key: key, value: key },
          cases[key].name
        );
      })
    )
  );
}

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(MultipleSelect, null), document.getElementById('__react-content'));

/***/ })

},[230]);
//# sourceMappingURL=optionLabelProp.js.map