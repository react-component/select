webpackJsonp([9],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(51);


/***/ },

/***/ 51:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Select = __webpack_require__(3);
	var Option = Select.Option;
	__webpack_require__(32);
	
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(React.createElement(
	    Option,
	    { key: i.toString(36) + i },
	    i.toString(36) + i
	  ));
	}
	
	var style = '.rc-select-menu {max-height:200px;overflow:auto;}';
	
	var Test = React.createClass({
	  displayName: 'Test',
	
	  getInitialState: function getInitialState() {
	    return {
	      disabled: false,
	      value: ['name2', 'name3']
	    };
	  },
	  handleChange: function handleChange(value) {
	    console.log('selected ' + value);
	    this.setState({
	      value: value
	    });
	  },
	  handleDisabled: function handleDisabled() {
	    this.setState({
	      disabled: !this.state.disabled
	    });
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'h2',
	        null,
	        'tags select（scroll the menu）'
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'style',
	          null,
	          style
	        ),
	        React.createElement(
	          Select,
	          { tags: true,
	            style: { width: 500 },
	            disabled: this.state.disabled,
	            maxTagTextLength: 10,
	            value: this.state.value,
	            onChange: this.handleChange },
	          children
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        React.createElement(
	          'button',
	          { onClick: this.handleDisabled },
	          'toggle disabled'
	        )
	      )
	    );
	  }
	});
	
	React.render(React.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=tags.js.map