webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(46);


/***/ },

/***/ 46:
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
	    'Select optionFilterProp'
	  ),
	  React.createElement(
	    'div',
	    { style: { width: 300 } },
	    React.createElement(
	      Select,
	      { value: '张三',
	        style: { width: 500 },
	        optionFilterProp: 'desc',
	        onChange: handleChange },
	      React.createElement(
	        Option,
	        { value: '张三', desc: '张三 zhang san' },
	        '张三'
	      ),
	      React.createElement(
	        Option,
	        { value: '李四', desc: '李四 li si' },
	        '李四'
	      ),
	      React.createElement(
	        Option,
	        { value: '王五', desc: '王五 wang wu' },
	        '王五'
	      )
	    )
	  )
	);
	
	React.render(c1, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=optionFilterProp.js.map