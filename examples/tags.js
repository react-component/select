webpackJsonp([13],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(370);


/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(184);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(341);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console: 0 */
	
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(_react2.default.createElement(
	    _rcSelect.Option,
	    { key: i.toString(36) + i },
	    i.toString(36) + i
	  ));
	}
	
	var Test = _react2.default.createClass({
	  displayName: 'Test',
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      value: ['name2', 'name3']
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('selected ' + value);
	    this.setState({
	      value: value
	    });
	  },
	  toggleDisabled: function toggleDisabled() {
	    this.setState({
	      disabled: !this.state.disabled
	    });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h2',
	        null,
	        'tags select\uFF08scroll the menu\uFF09'
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _rcSelect2.default,
	          {
	            placeholder: 'placeholder',
	            tags: true,
	            dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
	            style: { width: 500 },
	            disabled: this.state.disabled,
	            maxTagTextLength: 10,
	            value: this.state.value,
	            onChange: this.onChange,
	            tokenSeparators: [' ', ',']
	          },
	          children
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'button',
	          { onClick: this.toggleDisabled },
	          'toggle disabled'
	        )
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=tags.js.map