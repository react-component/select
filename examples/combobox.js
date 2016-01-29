webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console: 0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(159);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcSelect = __webpack_require__(160);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(230);
	
	var Test = _react2['default'].createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      value: 'l'
	    };
	  },
	
	  onChange: function onChange(value) {
	    this.setState({
	      value: value
	    });
	  },
	
	  onKeyDown: function onKeyDown(e) {
	    if (e.keyCode === 13) {
	      console.log('onEnter', this.state.value);
	    }
	  },
	
	  onSelect: function onSelect(v) {
	    console.log('onSelect', v);
	  },
	
	  toggleDisabled: function toggleDisabled() {
	    this.setState({
	      disabled: !this.state.disabled
	    });
	  },
	
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      null,
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'combobox'
	      ),
	      _react2['default'].createElement(
	        'p',
	        null,
	        _react2['default'].createElement(
	          'button',
	          { onClick: this.toggleDisabled },
	          'toggle disabled'
	        )
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { width: 300 }, onKeyDown: this.onKeyDown },
	        _react2['default'].createElement(
	          _rcSelect2['default'],
	          {
	            disabled: this.state.disabled,
	            style: { width: 500 },
	            onChange: this.onChange,
	            onSelect: this.onSelect,
	            defaultActiveFirstOption: false,
	            allowClear: true,
	            value: this.state.value,
	            combobox: true },
	          _react2['default'].createElement(
	            _rcSelect.Option,
	            { value: 'jack' },
	            _react2['default'].createElement(
	              'b',
	              { style: { color: 'red' } },
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
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=combobox.js.map