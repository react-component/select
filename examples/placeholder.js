webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(47);


/***/ },

/***/ 47:
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
	    'Select placeholder'
	  ),
	  React.createElement(
	    'div',
	    { style: { width: 300 } },
	    React.createElement(
	      Select,
	      {
	        placeholder: React.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: '输入过滤',
	        style: { width: 250 },
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
//# sourceMappingURL=placeholder.js.map