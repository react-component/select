webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(56);


/***/ },

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(3);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(44);
	
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(_react2['default'].createElement(
	    _rcSelect.Option,
	    { key: i.toString(36) + i },
	    i.toString(36) + i
	  ));
	}
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var c2 = _react2['default'].createElement(
	  'div',
	  null,
	  _react2['default'].createElement(
	    'h2',
	    null,
	    'multiple select（scroll the menu）'
	  ),
	  _react2['default'].createElement(
	    'div',
	    { style: { width: 300 } },
	    _react2['default'].createElement(
	      _rcSelect2['default'],
	      {
	        dropdownMenuStyle: {
	          maxHeight: 200,
	          overflow: 'auto'
	        },
	        renderDropdownToBody: location.href.indexOf('renderDropdownToBody') !== -1,
	        style: { width: 500 },
	        multiple: true,
	        value: ['name2', 'name3'],
	        onChange: handleChange },
	      children
	    )
	  )
	);
	
	_react2['default'].render(c2, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=multiple.js.map