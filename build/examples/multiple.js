webpackJsonp([1],[
/* 0 */
/*!**********************!*\
  !*** multi multiple ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./examples/multiple.js */3);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/*!******************************!*\
  !*** ./examples/multiple.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(/*! react */ 5);
	var Select = __webpack_require__(/*! rc-select */ 4);
	var Option = Select.Option;
	__webpack_require__(/*! ./examples.css */ 6);
	__webpack_require__(/*! rc-menu/assets/index.css */ 10);
	__webpack_require__(/*! rc-select/assets/index.css */ 8);
	var children = [];
	for (var i = 10; i < 36; i++) {
	  children.push(React.createElement(Option, {value: i.toString(36) + i}, i.toString(36) + i));
	}
	
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var style = '.rc-select-menu {height:200px;overflow:auto;}';
	
	var c2 = (
	  React.createElement("div", null, 
	    React.createElement("h1", null, "multiple select（scroll the menu）"), 
	    React.createElement("div", {style: {width: 300}}, 
	      React.createElement("style", null, 
	      style
	      ), 
	      React.createElement(Select, {multiple: true, value: ['name2', 'name3'], onChange: handleChange}, 
	    children
	      )
	    )
	  )
	);
	
	React.render(c2, document.getElementById('__react-content'));


/***/ }
]);
//# sourceMappingURL=multiple.js.map