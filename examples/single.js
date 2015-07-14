webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(53);


/***/ },

/***/ 53:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Select = __webpack_require__(3);
	var Option = Select.Option;
	__webpack_require__(37);
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var Test = React.createClass({
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
	    return React.createElement(
	      'div',
	      { style: { margin: 20 } },
	      React.createElement(
	        'h2',
	        null,
	        'Single Select'
	      ),
	      React.createElement(
	        'div',
	        { style: { width: 300 } },
	        React.createElement(
	          Select,
	          { value: 'lucy',
	            renderDropdownToBody: location.href.indexOf('renderDropdownToBody') !== -1,
	            style: { width: 500 },
	            onChange: handleChange },
	          React.createElement(
	            Option,
	            { value: 'jack' },
	            React.createElement(
	              'b',
	              { style: {
	                  color: 'red'
	                } },
	              'jack'
	            )
	          ),
	          React.createElement(
	            Option,
	            { value: 'lucy' },
	            'lucy'
	          ),
	          React.createElement(
	            Option,
	            { value: 'disabled', disabled: true },
	            'disabled'
	          ),
	          React.createElement(
	            Option,
	            { value: 'yiminghe' },
	            'yiminghe'
	          )
	        )
	      ),
	      React.createElement(
	        'h2',
	        null,
	        'native select'
	      ),
	      React.createElement(
	        'select',
	        { value: 'lucy',
	          style: { width: 500 },
	          onChange: handleChange },
	        React.createElement(
	          'option',
	          { value: 'jack' },
	          'jack'
	        ),
	        React.createElement(
	          'option',
	          { value: 'lucy' },
	          'lucy'
	        ),
	        React.createElement(
	          'option',
	          { value: 'disabled', disabled: true },
	          'disabled'
	        ),
	        React.createElement(
	          'option',
	          { value: 'yiminghe' },
	          'yiminghe'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        React.createElement(
	          'button',
	          { onClick: this.handleDestroy },
	          'destroy'
	        )
	      )
	    );
	  }
	});
	
	React.render(React.createElement(Test, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=single.js.map