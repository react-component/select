webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(351);


/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(179);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(332);
	
	var _reactDom = __webpack_require__(33);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint no-console: 0 */
	
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(_react2.default.createElement(
	    _rcSelect.Option,
	    { key: i.toString(36) + i, disabled: i === 10, title: '\u4E2D\u6587' + i },
	    '\u4E2D\u6587',
	    i
	  ));
	}
	
	function onSelect() {
	  console.log(arguments);
	}
	
	function onDeselect() {
	  console.log(arguments);
	}
	
	var Test = _react2.default.createClass({
	  displayName: 'Test',
	  getInitialState: function getInitialState() {
	    return {
	      useAnim: 0,
	      value: ['a10']
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', value);
	    this.setState({
	      value: value
	    });
	  },
	  useAnim: function useAnim(e) {
	    this.setState({
	      useAnim: e.target.checked
	    });
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
	        'multiple select\uFF08scroll the menu\uFF09'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'label',
	          null,
	          'anim',
	          _react2.default.createElement('input', { checked: this.state.useAnim, type: 'checkbox', onChange: this.useAnim })
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { width: 300 } },
	        _react2.default.createElement(
	          _rcSelect2.default,
	          {
	            value: this.state.value,
	            animation: this.state.useAnim ? 'slide-up' : null,
	            choiceTransitionName: 'rc-select-selection__choice-zoom',
	            dropdownMenuStyle: dropdownMenuStyle,
	            style: { width: 500 },
	            multiple: true,
	            optionFilterProp: 'children',
	            optionLabelProp: 'children',
	            onSelect: onSelect,
	            onDeselect: onDeselect,
	            placeholder: 'please select',
	            onChange: this.onChange,
	            onFocus: function onFocus() {
	              return console.log('focus');
	            },
	            tokenSeparators: [' ', ',']
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
//# sourceMappingURL=multiple.js.map