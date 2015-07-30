webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(60);


/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(3);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(44);
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var Test = _react2['default'].createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      destroy: false
	    };
	  },
	
	  handleDestroy: function handleDestroy() {
	    this.setState({
	      destroy: 1
	    });
	  },
	
	  render: function render() {
	    if (this.state.destroy) {
	      return null;
	    }
	    return _react2['default'].createElement(
	      'div',
	      { style: { margin: 20 } },
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
	          { value: "lucy",
	            dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
	            renderDropdownToBody: location.href.indexOf('renderDropdownToBody') !== -1,
	            style: { width: 500 },
	            onChange: handleChange },
	          _react2['default'].createElement(
	            _rcSelect.Option,
	            { value: "jack" },
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
	            { value: "lucy" },
	            'lucy'
	          ),
	          _react2['default'].createElement(
	            _rcSelect.Option,
	            { value: "disabled", disabled: true },
	            'disabled'
	          ),
	          _react2['default'].createElement(
	            _rcSelect.Option,
	            { value: "yiminghe" },
	            'yiminghe'
	          ),
	          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
	            return _react2['default'].createElement(
	              _rcSelect.Option,
	              { key: i },
	              i
	            );
	          })
	        )
	      ),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'native select'
	      ),
	      _react2['default'].createElement(
	        'select',
	        { value: "lucy",
	          style: { width: 500 },
	          onChange: handleChange },
	        _react2['default'].createElement(
	          'option',
	          { value: "jack" },
	          'jack'
	        ),
	        _react2['default'].createElement(
	          'option',
	          { value: "lucy" },
	          'lucy'
	        ),
	        _react2['default'].createElement(
	          'option',
	          { value: "disabled", disabled: true },
	          'disabled'
	        ),
	        _react2['default'].createElement(
	          'option',
	          { value: "yiminghe" },
	          'yiminghe'
	        )
	      ),
	      _react2['default'].createElement(
	        'p',
	        null,
	        _react2['default'].createElement(
	          'button',
	          { onClick: this.handleDestroy },
	          'destroy'
	        )
	      )
	    );
	  }
	});
	
	_react2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=single.js.map