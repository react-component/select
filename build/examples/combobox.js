webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(6);
	var Select = __webpack_require__(7);
	var Option = Select.Option;
	__webpack_require__(12);
	__webpack_require__(10);
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