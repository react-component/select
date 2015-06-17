webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Select = __webpack_require__(3);
	var Option = Select.Option;
	__webpack_require__(32);
	var pkg = __webpack_require__(36);
	var style = {
	  color: 'red'
	};
	var c3 = React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h1',
	    null,
	    pkg.name,
	    '@',
	    pkg.version
	  ),
	  React.createElement(
	    'h2',
	    null,
	    'combobox'
	  ),
	  React.createElement(
	    'div',
	    { style: { width: 300 } },
	    React.createElement(
	      Select,
	      { combobox: true },
	      React.createElement(
	        Option,
	        { value: 'jack' },
	        React.createElement(
	          'b',
	          { style: style },
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
	
	React.render(c3, document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=combobox.js.map