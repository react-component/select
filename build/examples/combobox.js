webpackJsonp([0],[
/* 0 */
/*!**********************!*\
  !*** multi combobox ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./examples/combobox.js */2);


/***/ },
/* 1 */,
/* 2 */
/*!******************************!*\
  !*** ./examples/combobox.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(/*! react */ 5);
	var Select = __webpack_require__(/*! ../ */ 4);
	var Option = Select.Option;
	__webpack_require__(/*! ./examples.css */ 6);
	__webpack_require__(/*! rc-menu/assets/index.css */ 10);
	__webpack_require__(/*! rc-select/assets/index.css */ 8);
	var style = {
	  color: 'red'
	};
	var c3 = (
	  React.createElement("div", null, 
	    React.createElement("h1", null, "combobox"), 
	    React.createElement("div", {style: {width: 300}}, 
	      React.createElement(Select, {combobox: true}, 
	        React.createElement(Option, {value: "jack"}, 
	          React.createElement("b", {style: style}, "jack")
	        ), 
	        React.createElement(Option, {value: "lucy"}, "lucy"), 
	        React.createElement(Option, {value: "disabled", disabled: true}, "disabled"), 
	        React.createElement(Option, {value: "yiminghe"}, "yiminghe")
	      )
	    )
	  )
	);
	
	React.render(c3, document.getElementById('__react-content'));


/***/ }
]);
//# sourceMappingURL=combobox.js.map