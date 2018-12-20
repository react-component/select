/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"examples/dropdownRender": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([3,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/dropdownRender.js":
/*!************************************!*\
  !*** ./examples/dropdownRender.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/classCallCheck'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/createClass'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/possibleConstructorReturn'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/getPrototypeOf'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/inherits'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/defineProperty'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/_react@16.7.0@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rc_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rc-select */ "./index.js");
/* harmony import */ var rc_select__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rc_select__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-select/assets/index.less */ "./assets/index.less");
/* harmony import */ var rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-dom */ "./node_modules/_react-dom@16.7.0@react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_4__);








/* eslint no-console: 0 */




var children = [];

for (var i = 10; i < 36; i++) {
  children.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
    key: i.toString(36) + i,
    test: i
  }, i.toString(36) + i));
}

var Test =
/*#__PURE__*/
function (_React$Component) {
  !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/inherits'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Test, _React$Component);

  function Test() {
    var _getPrototypeOf2;

    var _this;

    !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/classCallCheck'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, Test);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/possibleConstructorReturn'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, (_getPrototypeOf2 = !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/getPrototypeOf'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Test)).call.apply(_getPrototypeOf2, [this].concat(args)));

    !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/defineProperty'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_this)), "state", {
      value: ['name2', 'name3']
    });

    !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/defineProperty'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_this)), "onChange", function (value, option) {
      console.log("changed ".concat(value), option);

      _this.setState({
        value: value
      });
    });

    !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/defineProperty'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_this)), "onSelect", function (value, option) {
      console.log("selected ".concat(value), option.props);
    });

    !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/defineProperty'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(!(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/assertThisInitialized'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_this)), "onDeselect", function (value, option) {
      console.log("deselected ".concat(value), option);
    });

    return _this;
  }

  !(function webpackMissingModule() { var e = new Error("Cannot find module '@babel/runtime/helpers/createClass'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Test, [{
    key: "render",
    value: function render() {
      var value = this.state.value;
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        onMouseDown: function onMouseDown(e) {
          e.preventDefault();
          return false;
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "custom dropdown render select"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2___default.a, {
        placeholder: "placeholder",
        tags: true,
        dropdownMenuStyle: {
          maxHeight: 200
        },
        style: {
          width: 500
        },
        value: value,
        onChange: this.onChange,
        onSelect: this.onSelect,
        onDeselect: this.onDeselect,
        tokenSeparators: [' ', ','],
        onFocus: function onFocus() {
          return console.log('focus');
        },
        onBlur: function onBlur() {
          return console.log('blur');
        },
        dropdownRender: function dropdownRender(menu) {
          return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
            onClick: function onClick() {
              console.log('before clicked');
            }
          }, "BEFORE"), menu, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
            onClick: function onClick() {
              console.log('after clicked');
            }
          }, "AFTER"));
        }
      }, children)));
    }
  }]);

  return Test;
}(react__WEBPACK_IMPORTED_MODULE_1___default.a.Component);

react_dom__WEBPACK_IMPORTED_MODULE_4___default.a.render(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ }),

/***/ 3:
/*!******************************************!*\
  !*** multi ./examples/dropdownRender.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/dropdownRender.js */"./examples/dropdownRender.js");


/***/ })

/******/ });
//# sourceMappingURL=dropdownRender.js.map