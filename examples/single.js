webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(355);


/***/ },

/***/ 355:
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
	
	var Test = _react2.default.createClass({
	  displayName: 'Test',
	  getInitialState: function getInitialState() {
	    return {
	      destroy: false,
	      value: String(9)
	    };
	  },
	  onChange: function onChange(e) {
	    var value = void 0;
	    if (e && e.target) {
	      value = e.target.value;
	    } else {
	      value = e;
	    }
	    console.log('onChange', value);
	    this.setState({
	      value: value
	    });
	  },
	  onDestroy: function onDestroy() {
	    this.setState({
	      destroy: 1
	    });
	  },
	  onBlur: function onBlur(v) {
	    console.log('onBlur', v);
	  },
	  onFocus: function onFocus() {
	    console.log('onFocus');
	  },
	  render: function render() {
	    if (this.state.destroy) {
	      return null;
	    }
	    return _react2.default.createElement(
	      'div',
	      { style: { margin: 20 } },
	      _react2.default.createElement('div', { style: { height: 150 } }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'Single Select'
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: { width: 300 } },
	        _react2.default.createElement(
	          _rcSelect2.default,
	          {
	            value: this.state.value,
	            placeholder: 'placeholder',
	            dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
	            style: { width: 500 },
	            onBlur: this.onBlur,
	            onFocus: this.onFocus,
	            allowClear: true,
	            optionLabelProp: 'children',
	            optionFilterProp: 'text',
	            onChange: this.onChange
	          },
	          _react2.default.createElement(
	            _rcSelect.Option,
	            { value: '01', text: 'jack', title: 'jack' },
	            _react2.default.createElement(
	              'b',
	              {
	                style: {
	                  color: 'red'
	                }
	              },
	              'jack'
	            )
	          ),
	          _react2.default.createElement(
	            _rcSelect.Option,
	            { value: '11', text: 'lucy' },
	            'lucy'
	          ),
	          _react2.default.createElement(
	            _rcSelect.Option,
	            { value: '21', disabled: true, text: 'disabled' },
	            'disabled'
	          ),
	          _react2.default.createElement(
	            _rcSelect.Option,
	            { value: '31', text: 'yiminghe' },
	            'yiminghe'
	          ),
	          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
	            return _react2.default.createElement(
	              _rcSelect.Option,
	              { key: i, text: String(i) },
	              i
	            );
	          })
	        )
	      ),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'native select'
	      ),
	      _react2.default.createElement(
	        'select',
	        {
	          value: this.state.value,
	          style: { width: 500 },
	          onChange: this.onChange
	        },
	        _react2.default.createElement(
	          'option',
	          { value: '01' },
	          'jack'
	        ),
	        _react2.default.createElement(
	          'option',
	          { value: '11' },
	          'lucy'
	        ),
	        _react2.default.createElement(
	          'option',
	          { value: '21', disabled: true },
	          'disabled'
	        ),
	        _react2.default.createElement(
	          'option',
	          { value: '31' },
	          'yiminghe'
	        ),
	        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
	          return _react2.default.createElement(
	            'option',
	            { value: i, key: i },
	            i
	          );
	        })
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'button',
	          { onClick: this.onDestroy },
	          'destroy'
	        )
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=single.js.map