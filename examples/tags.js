webpackJsonp([5],{

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
	__webpack_require__(31);
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(React.createElement(
	    Option,
	    { value: i.toString(36) + i },
	    i.toString(36) + i
	  ));
	}
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var style = '.rc-select-menu {max-height:200px;overflow:auto;}';
	
	var c2 = React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h1',
	    null,
	    'tags select（scroll the menu）'
	  ),
	  React.createElement(
	    'div',
	    { style: { width: 300 } },
	    React.createElement(
	      'style',
	      null,
	      style
	    ),
	    React.createElement(
	      Select,
	      { tags: true, value: ['name2', 'name3'],
	        onChange: handleChange },
	      children
	    )
	  )
	);
	
	React.render(c2, document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=tags.js.map