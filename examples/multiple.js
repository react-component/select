webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(233);


/***/ },

/***/ 233:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(159);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(220);
	
	var _reactDom = __webpack_require__(158);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(_react2['default'].createElement(
	    _rcSelect.Option,
	    { key: i.toString(36) + i },
	    i.toString(36) + i
	  ));
	}
	
	function onChange(value) {
	  console.log('selected ' + value);
	}
	
	function onSelect() {
	  console.log(arguments);
	}
	
	function onDeselect() {
	  console.log(arguments);
	}
	
	var Test = _react2['default'].createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      useAnim: 0
	    };
	  },
	  useAnim: function useAnim(e) {
	    this.setState({
	      useAnim: e.target.checked
	    });
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'multiple select（scroll the menu）'
	      ),
	      _react2['default'].createElement(
	        'p',
	        null,
	        _react2['default'].createElement(
	          'label',
	          null,
	          'anim ',
	          _react2['default'].createElement('input', { checked: this.state.useAnim, type: 'checkbox', onChange: this.useAnim })
	        )
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { width: 300 } },
	        _react2['default'].createElement(
	          _rcSelect2['default'],
	          {
	            animation: this.state.useAnim ? "slide-up" : null,
	            dropdownMenuStyle: {
	              maxHeight: 200,
	              overflow: 'auto'
	            },
	            style: { width: 500 },
	            multiple: true,
	            defaultValue: ['name2', 'name3'],
	            onSelect: onSelect,
	            onDeselect: onDeselect,
	            onChange: onChange },
	          children
	        )
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=multiple.js.map