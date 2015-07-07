webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(48);


/***/ },

/***/ 48:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Select = __webpack_require__(3);
	var Option = Select.Option;
	__webpack_require__(32);
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var c1 = React.createElement(
	  'div',
	  null,
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
	  )
	);
	
	React.render(c1, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=single.js.map