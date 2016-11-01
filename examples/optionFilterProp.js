webpackJsonp([9],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(344);


/***/ },

/***/ 344:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(173);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(322);
	
	var _reactDom = __webpack_require__(35);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console: 0 */
	
	function onChange(value) {
	  console.log('selected ' + value);
	}
	
	var c1 = _react2.default.createElement(
	  'div',
	  null,
	  _react2.default.createElement(
	    'h2',
	    null,
	    'Select optionFilterProp'
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: { width: 300 } },
	    _react2.default.createElement(
	      _rcSelect2.default,
	      {
	        defaultValue: '\u5F20\u4E09',
	        style: { width: 500 },
	        placeholder: 'placeholder',
	        optionFilterProp: 'desc',
	        onChange: onChange
	      },
	      _react2.default.createElement(
	        _rcSelect.Option,
	        { value: '\u5F20\u4E09', desc: '\u5F20\u4E09 zhang san' },
	        '\u5F20\u4E09'
	      ),
	      _react2.default.createElement(
	        _rcSelect.Option,
	        { value: '\u674E\u56DB', desc: '\u674E\u56DB li si' },
	        '\u674E\u56DB'
	      ),
	      _react2.default.createElement(
	        _rcSelect.Option,
	        { value: '\u738B\u4E94', desc: '\u738B\u4E94 wang wu' },
	        '\u738B\u4E94'
	      )
	    )
	  )
	);
	
	_reactDom2.default.render(c1, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=optionFilterProp.js.map