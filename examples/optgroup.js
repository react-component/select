webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(62);


/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(3);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(48);
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var c1 = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'Select OptGroup'
	  ),
	  _react2['default'].createElement(
	    'div',
	    { style: { width: 300 } },
	    _react2['default'].createElement(
	      _rcSelect2['default'],
	      { value: 'lucy',
	        renderDropdownToBody: location.href.indexOf('renderDropdownToBody') !== -1,
	        showSearch: false,
	        style: { width: 500 },
	        onChange: handleChange },
	      _react2['default'].createElement(
	        _rcSelect.OptGroup,
	        { label: 'manager' },
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
	        )
	      ),
	      _react2['default'].createElement(
	        _rcSelect.OptGroup,
	        { label: 'engineer' },
	        _react2['default'].createElement(
	          _rcSelect.Option,
	          { value: 'yiminghe' },
	          'yiminghe'
	        )
	      )
	    )
	  )
	);
	
	_react2['default'].render(c1, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=optgroup.js.map