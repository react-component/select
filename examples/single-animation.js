webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(247);


/***/ },

/***/ 247:
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console: 0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(160);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(229);
	
	var _reactDom = __webpack_require__(159);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function onChange(value) {
	  console.log('selected ' + value);
	}
	
	var c1 = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement('div', { style: { height: 150 } }),
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'Single Select'
	  ),
	  _react2['default'].createElement(
	    'div',
	    { style: { width: 300 } },
	    _react2['default'].createElement(
	      _rcSelect2['default'],
	      { defaultValue: 'lucy',
	        style: { width: 500 },
	        animation: 'slide-up',
	        showSearch: false,
	        onChange: onChange },
	      _react2['default'].createElement(
	        _rcSelect.Option,
	        { value: 'jack' },
	        _react2['default'].createElement(
	          'b',
	          { style: {
	              color: 'red'
	            } },
	          'jack'
	        )
	      ),
	      _react2['default'].createElement(
	        _rcSelect.Option,
	        { value: 'lucy' },
	        'lucy'
	      ),
	      _react2['default'].createElement(
	        _rcSelect.Option,
	        { value: 'disabled', disabled: true },
	        'disabled'
	      ),
	      _react2['default'].createElement(
	        _rcSelect.Option,
	        { value: 'yiminghe' },
	        'yiminghe'
	      )
	    )
	  )
	);
	
	_reactDom2['default'].render(c1, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=single-animation.js.map