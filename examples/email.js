webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(205);


/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _rcSelect = __webpack_require__(158);
	
	var _rcSelect2 = _interopRequireDefault(_rcSelect);
	
	__webpack_require__(204);
	
	var Test = _react2['default'].createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      options: []
	    };
	  },
	  onSelect: function onSelect(value) {
	    console.log('onSelect', value);
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', value);
	    var options;
	    if (!value || value.indexOf('@') >= 0) {
	      options = _react2['default'].createElement(
	        _rcSelect.Option,
	        { key: value },
	        value
	      );
	    } else {
	      options = ['gmail.com', 'yahoo.com', 'outlook.com'].map(function (domain) {
	        var email = value + '@' + domain;
	        return _react2['default'].createElement(
	          _rcSelect.Option,
	          { key: email },
	          email
	        );
	      });
	    }
	    this.setState({
	      options: options
	    });
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      _rcSelect2['default'],
	      { combobox: true,
	        style: { width: 200 },
	        onChange: this.onChange,
	        onSelect: this.onSelect,
	        searchPlaceholder: '请输入账户名' },
	      this.state.options
	    );
	  }
	});
	
	_react2['default'].render(_react2['default'].createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=email.js.map