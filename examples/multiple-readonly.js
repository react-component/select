webpackJsonp([7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(342);


/***/ },

/***/ 342:
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
	var children = [];
	for (var i = 10; i < 36; i++) {
	  // 11 => readonly selected item
	  children.push(_react2.default.createElement(
	    _rcSelect.Option,
	    { disabled: i === 11, key: i.toString(36) + i },
	    '\u4E2D\u6587',
	    i
	  ));
	}
	
	var Test = _react2.default.createClass({
	  displayName: 'Test',
	  getInitialState: function getInitialState() {
	    return {
	      value: ['b11']
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', value);
	    this.setState({ value: value });
	  },
	  render: function render() {
	    var dropdownMenuStyle = {
	      maxHeight: 200,
	      overflow: 'auto'
	    };
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h2',
	        null,
	        'multiple readonly default selected item'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { width: 300 } },
	        _react2.default.createElement(
	          _rcSelect2.default,
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
	});
	
	_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=multiple-readonly.js.map