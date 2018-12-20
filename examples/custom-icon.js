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
/******/ 		"examples/custom-icon": 0
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
/******/ 	deferredModules.push([2,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/custom-icon.js":
/*!*********************************!*\
  !*** ./examples/custom-icon.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/_react@16.7.0@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/_react-dom@16.7.0@react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rc_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rc-select */ "./index.js");
/* harmony import */ var rc_select__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rc_select__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-select/assets/index.less */ "./assets/index.less");
/* harmony import */ var rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rc_select_assets_index_less__WEBPACK_IMPORTED_MODULE_3__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint no-console: 0 */

/* eslint react/no-multi-comp: 0 */




var arrowPath = 'M632 888H392c-4.4 0-8 3.6-8 8v32c0 ' + '17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-3' + '2c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-3' + '28 328 0 121.4 66 227.4 164 284.1V792c0 17.7 1' + '4.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98' + '-56.7 164-162.7 164-284.1 0-181.1-146.9-328-32' + '8-328z m127.9 549.8L604 634.6V752H420V634.6l-3' + '5.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4' + ' 114.6-256 256-256s256 114.6 256 256c0 92.5-49' + '.4 176.3-128.1 221.8z';
var clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' + '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' + '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' + ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' + '28.7 64-64V306c0-35.3-28.7-64-64-64z';

var menuItemSelectedIcon = function menuItemSelectedIcon(props) {
  var p = _extends({}, props);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    style: {
      position: 'absolute',
      right: 0
    }
  }, p.isSelected ? '🌹' : '☑️');
};

var singleItemIcon = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  style: {
    position: 'absolute',
    right: '0px'
  },
  role: "img",
  "aria-label": "rose"
}, "\uD83C\uDF39");

var getSvg = function getSvg(path) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    style: {
      verticalAlign: '-.125em '
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: path,
    "p-id": "5827"
  })));
};

var Demo =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Demo)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      disabled: false,
      value: ''
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChange", function (value, option) {
      console.log('onChange', value, option);

      _this.setState({
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyDown", function (e) {
      var value = _this.state.value;

      if (e.keyCode === 13) {
        console.log('onEnter', value);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSelect", function (v, option) {
      console.log('onSelect', v, option);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toggleDisabled", function () {
      var disabled = _this.state.disabled;

      _this.setState({
        disabled: !disabled
      });
    });

    return _this;
  }

  _createClass(Demo, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          disabled = _this$state.disabled,
          value = _this$state.value;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "combobox"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: this.toggleDisabled
      }, "toggle disabled")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          width: 300
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2___default.a, {
        className: "custom-select",
        disabled: disabled,
        style: {
          width: 500
        },
        onChange: this.onChange,
        onSelect: this.onSelect,
        onInputKeyDown: this.onKeyDown,
        notFoundContent: "",
        allowClear: true,
        placeholder: "please select",
        value: value,
        combobox: true,
        backfill: true,
        inputIcon: getSvg(arrowPath, {
          className: "custom-arrow-icon"
        }, true),
        clearIcon: getSvg(clearPath, {
          className: "custom-clear-icon"
        }, true),
        removeIcon: getSvg(clearPath, {
          className: "custom-remove-icon"
        }, true),
        menuItemSelectedIcon: singleItemIcon
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
        value: "jack"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", {
        style: {
          color: 'red'
        }
      }, "jack")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
        value: "lucy"
      }, "lucy"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
        value: "disabled",
        disabled: true
      }, "disabled"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
        value: "yiminghe"
      }, "yiminghe"))));
    }
  }]);

  return Demo;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var children = [];

for (var i = 10; i < 36; i++) {
  children.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2__["Option"], {
    key: i.toString(36) + i,
    disabled: i === 10,
    title: "\u4E2D\u6587".concat(i)
  }, "\u4E2D\u6587", i));
}

var Test =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Test, _React$Component2);

  function Test() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, Test);

    for (var _len2 = arguments.length, _args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      _args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(Test)).call.apply(_getPrototypeOf3, [this].concat(_args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "state", {
      useAnim: 0,
      value: ['a10']
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "onChange", function (value, options) {
      console.log('onChange', value, options);

      _this2.setState({
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "onSelect", function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      console.log(args);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "onDeselect", function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      console.log(args);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "useAnim", function (e) {
      _this2.setState({
        useAnim: e.target.checked
      });
    });

    return _this2;
  }

  _createClass(Test, [{
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          useAnim = _this$state2.useAnim,
          value = _this$state2.value;
      var dropdownMenuStyle = {
        maxHeight: 200
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "multiple select\uFF08scroll the menu\uFF09"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "useAnim"
      }, "anim", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        id: "useAnim",
        checked: useAnim,
        type: "checkbox",
        onChange: this.useAnim
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          width: 300
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(rc_select__WEBPACK_IMPORTED_MODULE_2___default.a, {
        className: "custom-select",
        value: value,
        animation: useAnim ? 'slide-up' : null,
        choiceTransitionName: "rc-select-selection__choice-zoom",
        dropdownMenuStyle: dropdownMenuStyle,
        style: {
          width: 500
        },
        multiple: true,
        allowClear: true,
        optionFilterProp: "children",
        optionLabelProp: "children",
        onSelect: this.onSelect,
        onDeselect: this.onDeselect,
        placeholder: "please select",
        onChange: this.onChange,
        onFocus: function onFocus() {
          return console.log('focus');
        },
        tokenSeparators: [' ', ','],
        inputIcon: getSvg(arrowPath),
        clearIcon: getSvg(clearPath),
        removeIcon: getSvg(clearPath),
        menuItemSelectedIcon: menuItemSelectedIcon
      }, children)));
    }
  }]);

  return Test;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Demo, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Test, null)), document.getElementById('__react-content'));

/***/ }),

/***/ 2:
/*!***************************************!*\
  !*** multi ./examples/custom-icon.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/custom-icon.js */"./examples/custom-icon.js");


/***/ })

/******/ });
//# sourceMappingURL=custom-icon.js.map