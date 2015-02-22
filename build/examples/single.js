webpackJsonp([2],[
/* 0 */
/*!********************!*\
  !*** multi single ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./examples/single.js */1);


/***/ },
/* 1 */
/*!****************************!*\
  !*** ./examples/single.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(/*! react */ 4);
	var Select = __webpack_require__(/*! rc-select */ 5);
	var Option = Select.Option;
	__webpack_require__(/*! ./examples.css */ 6);
	__webpack_require__(/*! rc-menu/assets/index.css */ 10);
	__webpack_require__(/*! rc-select/assets/index.css */ 8);
	function handleChange(value) {
	  console.log('selected ' + value);
	}
	
	var c1 = (
	  React.createElement("div", null, 
	    React.createElement("h1", null, "Single Select"), 
	    React.createElement("div", {style: {width: 300}}, 
	      React.createElement(Select, {value: "lucy", className: "forTest", onChange: handleChange}, 
	        React.createElement(Option, {value: "jack", className: "forTest"}, 
	          React.createElement("b", {style: {
	            color: 'red'
	          }}, "jack")
	        ), 
	        React.createElement(Option, {value: "lucy"}, "lucy"), 
	        React.createElement(Option, {value: "disabled", disabled: true}, "disabled"), 
	        React.createElement(Option, {value: "yiminghe"}, "yiminghe")
	      )
	    )
	  )
	);
	
	React.render(c1, document.getElementById('__react-content'));


/***/ }
]);
//# sourceMappingURL=single.js.map