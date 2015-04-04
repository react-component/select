/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		5:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"single","1":"tags","2":"combobox","3":"suggest","4":"multiple"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var Select = __webpack_require__(12);
	Select.Option = __webpack_require__(13);
	module.exports = Select;


/***/ },
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/yiminghe/code/react-components/select/node_modules/rc-tools/node_modules/css-loader/index.js!/Users/yiminghe/code/react-components/select/assets/index.css", function() {
			var newContent = require("!!/Users/yiminghe/code/react-components/select/node_modules/rc-tools/node_modules/css-loader/index.js!/Users/yiminghe/code/react-components/select/assets/index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(17)();
	exports.push([module.id, ".rc-select {\n  box-sizing: border-box;\n  display: inline-block;\n  margin: 0;\n  position: relative;\n  vertical-align: middle;\n}\n.rc-select .rc-select-selection {\n  outline: none;\n}\n.rc-select ul,\n.rc-select li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.rc-select > ul > li > a {\n  padding: 0;\n  background-color: #fff;\n}\n.rc-select .rc-select-arrow {\n  height: 26px;\n  position: absolute;\n  top: 1px;\n  right: 1px;\n  width: 20px;\n}\n.rc-select .rc-select-arrow b {\n  border-color: #888 transparent transparent transparent;\n  border-style: solid;\n  border-width: 5px 4px 0 4px;\n  height: 0;\n  left: 50%;\n  margin-left: -4px;\n  margin-top: -2px;\n  position: absolute;\n  top: 50%;\n  width: 0;\n}\n.rc-select .rc-select-selection--single {\n  box-sizing: border-box;\n  cursor: pointer;\n  display: block;\n  height: 28px;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none;\n  -webkit-user-select: none;\n  background-color: #fff;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n}\n.rc-select .rc-select-selection--single .rc-select-selection__rendered {\n  display: block;\n  overflow: hidden;\n  padding-left: 8px;\n  padding-right: 20px;\n  text-overflow: ellipsis;\n  color: #444;\n  line-height: 28px;\n}\n.rc-select .rc-select-selection--single .rc-select-selection__clear {\n  cursor: pointer;\n  float: right;\n  font-weight: bold;\n}\n.rc-select .rc-select-selection--multiple {\n  box-sizing: border-box;\n  display: block;\n  min-height: 32px;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none;\n  -webkit-user-select: none;\n  background-color: white;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  cursor: text;\n}\n.rc-select .rc-select-selection--multiple .rc-select-selection__rendered {\n  display: inline-block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-left: 8px;\n}\n.rc-select .rc-select-selection--multiple .rc-select-selection__clear {\n  cursor: pointer;\n  float: right;\n  font-weight: bold;\n  margin-top: 5px;\n  margin-right: 10px;\n}\n.rc-select .rc-select-selection--multiple .rc-select-selection__choice {\n  background-color: #e4e4e4;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  cursor: default;\n  float: left;\n  margin-right: 5px;\n  margin-top: 5px;\n  padding: 0 5px;\n}\n.rc-select .rc-select-selection--multiple .rc-select-selection__choice__remove {\n  color: #999;\n  cursor: pointer;\n  display: inline-block;\n  font-weight: bold;\n  margin-right: 2px;\n}\n.rc-select .rc-select-selection--multiple .rc-select-selection__choice__remove:hover {\n  color: #333;\n}\n.rc-select .rc-select-search--inline {\n  float: left;\n}\n.rc-select .rc-select-search--inline .rc-select-search__field {\n  border: none;\n  font-size: 100%;\n  margin-top: 5px;\n  background: transparent;\n  outline: 0;\n}\n.rc-select-dropdown {\n  display: none;\n  background-color: white;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  box-sizing: border-box;\n  width: 100%;\n  z-index: 100;\n  border-top: none;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  position: absolute;\n  top: 100%;\n  marin-top: -1px;\n  outline: none;\n}\n.rc-select-dropdown .rc-select-menu-item[aria-selected=true] {\n  background-color: #ddd;\n}\n.rc-select-search--dropdown {\n  display: block;\n  padding: 4px;\n}\n.rc-select-search--dropdown .rc-select-search__field {\n  padding: 4px;\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #aaa;\n}\n.rc-select-search--dropdown.rc-select-search--hide {\n  display: none;\n}\n.rc-select-open .rc-select-arrow b {\n  border-color: transparent transparent #888 transparent;\n  border-width: 0 4px 5px 4px;\n}\n.rc-select-open .rc-select-dropdown {\n  display: block;\n}\n.rc-select-open .rc-select-selection {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.rc-select-menu {\n  outline: none;\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n  z-index: 99999;\n}\n.rc-select-menu .rc-select-menu-item-active,\n.rc-select-menu .rc-select-menu-submenu-active {\n  background-color: #8EC8F9 !important;\n}\n.rc-select-menu > li {\n  position: relative;\n  display: block;\n  padding: 15px 20px;\n  white-space: nowrap;\n}\n.rc-select-menu > li.rc-select-menu-item-disabled,\n.rc-select-menu > li.rc-select-menu-submenu-disabled {\n  color: #777;\n}\n.rc-select-menu .rc-select-menu-item-divider {\n  padding: 0;\n  height: 1px;\n  margin: 9px 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n", ""]);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/**
	 * Select
	 */
	var React = __webpack_require__(6);
	var rcUtil = __webpack_require__(18);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	var KeyCode = rcUtil.KeyCode;
	var Menu = __webpack_require__(19);
	var MenuItem = Menu.Item;

	function isMultipleOrTags(props) {
	  return props.multiple || props.tags;
	}

	function noop() {
	}

	function getValueFromOptionChild(child) {
	  var optionProps = child.props;
	  var children = optionProps.children;
	  var ret;
	  if (optionProps.value !== undefined) {
	    if (typeof optionProps.value === 'string') {
	      ret = optionProps.value;
	    }
	  } else if (typeof children === 'string') {
	    ret = children;
	  }
	  if (!ret && !child.props.disabled) {
	    throw new Error('must set value string on Option element!');
	  }

	  return ret;
	}

	function getPropsFromOption(child) {
	  var ret = {
	    key: getValueFromOptionChild(child),
	    value: getValueFromOptionChild(child)
	  };
	  var optionProps = child.props;
	  for (var i in optionProps) {
	    if (i !== 'children') {
	      ret[i] = optionProps[i];
	    }
	  }
	  return ret;
	}

	function normValue(value) {
	  if (value === undefined) {
	    value = [];
	  } else if (!Array.isArray(value)) {
	    value = [value];
	  }
	  return value;
	}

	var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){Select[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;Select.prototype=Object.create(____SuperProtoOf____Class0);Select.prototype.constructor=Select;Select.__superConstructor__=____Class0;
	  function Select(props) {"use strict";
	    ____Class0.call(this,props);
	    this.state = {
	      value: normValue(props.value),
	      inputValue: ''
	    };
	    ['handleClick',
	      'handleKeyDown',
	      'handleInputKeyDown',
	      'handleInputChange',
	      'handleFocus',
	      'handleBlur',
	      'handleClearSelection',
	      'handleMenuSelect',
	      'handleMenuDeselect'].forEach(function(m) {
	        this[m] = this[m].bind(this);
	      }.bind(this));
	  }

	  Object.defineProperty(Select.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function(nextProps) {"use strict";
	    this.setState({
	      value: normValue(nextProps.value)
	    });
	  }});

	  Object.defineProperty(Select.prototype,"renderFilterOptions",{writable:true,configurable:true,value:function() {"use strict";
	    var inputValue = this.state.inputValue;
	    var sel = [];
	    var props = this.props;
	    var childrenKeys = [];
	    var filterOption = props.filterOption;
	    var tags = props.tags;
	    React.Children.forEach(props.children, function(child) {
	      if (!filterOption || !inputValue || !child.props.disabled && getValueFromOptionChild(child).indexOf(inputValue) > -1) {
	        sel.push(child);
	      }
	      if (tags && !child.props.disabled) {
	        childrenKeys.push(getValueFromOptionChild(child));
	      }
	    });
	    if (tags) {
	      var value = this.state.value || [];
	      value = value.filter(function(v) {
	        return childrenKeys.indexOf(v) === -1 && (!inputValue || v.indexOf(inputValue) > -1);
	      });
	      sel = sel.concat(value.map(function(v) {
	        return React.createElement(MenuItem, {value: v}, v);
	      }));
	      if (inputValue) {
	        var notFindInputItem = sel.every(function(s) {
	          return getValueFromOptionChild(s) !== inputValue;
	        });
	        if (notFindInputItem) {
	          sel.unshift(React.createElement(MenuItem, {value: inputValue}, inputValue));
	        }
	      }
	    }
	    if (!sel.length) {
	      sel = React.createElement(MenuItem, {disabled: true, value: "NOT_FOUND"}, props.notFoundContent);
	    }
	    return sel;
	  }});

	  Object.defineProperty(Select.prototype,"setOpenState",{writable:true,configurable:true,value:function(open) {"use strict";
	    this.setState({
	      open: open
	    }, function() {
	      if (open || isMultipleOrTags(this.props) || this.props.combobox) {
	        this.refs.input.getDOMNode().focus();
	      } else {
	        this.refs.selection.getDOMNode().focus();
	      }
	    }.bind(this));
	  }});

	  Object.defineProperty(Select.prototype,"handleInputChange",{writable:true,configurable:true,value:function(e) {"use strict";
	    var val = e.target.value;
	    this.setState({
	      inputValue: val,
	      open: true
	    });
	    if (this.props.combobox) {
	      this.setState({
	        value: val ? [val] : []
	      });
	      this.props.onChange(val);
	    }
	  }});

	  Object.defineProperty(Select.prototype,"handleClick",{writable:true,configurable:true,value:function() {"use strict";
	    this.setOpenState(!this.state.open);
	  }});

	  // combobox ignore
	  Object.defineProperty(Select.prototype,"handleKeyDown",{writable:true,configurable:true,value:function(e) {"use strict";
	    var keyCode = e.keyCode;
	    if (keyCode === KeyCode.ENTER || e.keyCode === KeyCode.DOWN) {
	      this.handleClick(e);
	      e.preventDefault();
	    }
	  }});

	  Object.defineProperty(Select.prototype,"handleInputKeyDown",{writable:true,configurable:true,value:function(e) {"use strict";
	    if (e.keyCode === KeyCode.DOWN) {
	      if (!this.state.open) {
	        this.setState({
	          open: true
	        });
	        e.preventDefault();
	        e.stopPropagation();
	        return;
	      }
	    } else if (e.keyCode === KeyCode.ESC) {
	      if (this.state.open) {
	        this.setOpenState(false);
	        e.preventDefault();
	        e.stopPropagation();
	      }
	      return;
	    }
	    if (this.refs.menu) {
	      if (this.refs.menu.handleKeyDown(e)) {
	        e.preventDefault();
	        e.stopPropagation();
	      }
	    }
	  }});

	  Object.defineProperty(Select.prototype,"handleMenuSelect",{writable:true,configurable:true,value:function(key, item) {"use strict";
	    var value;
	    var props = this.props;
	    var selectedValue = item.props.value;
	    if (isMultipleOrTags(props)) {
	      value = this.state.value.concat();
	      value.push(selectedValue);
	    } else {
	      if (this.state.value[0] === selectedValue) {
	        this.setOpenState(false);
	        return;
	      }
	      value = [selectedValue];
	    }
	    props.onSelect(selectedValue);
	    props.onChange(isMultipleOrTags(props) ? value : value[0]);
	    this.setState({
	      value: value,
	      inputValue: ''
	    });
	    this.setOpenState(false);
	    if (props.combobox) {
	      this.setState({
	        inputValue: value[0]
	      });
	    }
	  }});

	  Object.defineProperty(Select.prototype,"handleMenuDeselect",{writable:true,configurable:true,value:function(key, item, e) {"use strict";
	    if (e.type === 'click') {
	      this.removeSelected(item.props.value);
	    }
	    this.setState({
	      inputValue: ''
	    });
	    this.setOpenState(false);
	  }});

	  Object.defineProperty(Select.prototype,"handleBlur",{writable:true,configurable:true,value:function() {"use strict";
	    if (this.$Select_blurTimer) {
	      clearTimeout(this.$Select_blurTimer);
	    }
	    this.$Select_blurTimer = setTimeout(function()  {
	      this.setState({
	        open: false
	      });
	    }.bind(this), 100);
	  }});

	  Object.defineProperty(Select.prototype,"handleFocus",{writable:true,configurable:true,value:function() {"use strict";
	    if (this.$Select_blurTimer) {
	      clearTimeout(this.$Select_blurTimer);
	    }
	  }});

	  Object.defineProperty(Select.prototype,"removeSelected",{writable:true,configurable:true,value:function(selectedValue) {"use strict";
	    var props = this.props;
	    var value = this.state.value.filter(function(v) {
	      return v !== selectedValue;
	    });
	    var canMultiple = isMultipleOrTags(props);
	    if (canMultiple) {
	      props.onDeselect(selectedValue);
	    }
	    props.onChange(isMultipleOrTags(props) ? value : value[0]);
	    this.setState({
	      value: value
	    });
	  }});

	  Object.defineProperty(Select.prototype,"handleClearSelection",{writable:true,configurable:true,value:function(e) {"use strict";
	    e.stopPropagation();
	    if (this.state.inputValue || this.state.value.length) {
	      this.props.onChange(isMultipleOrTags(this.props) ? [] : undefined);
	      this.setState({
	        value: [],
	        inputValue: ''
	      });
	    }
	    this.setOpenState(false);
	  }});

	  Object.defineProperty(Select.prototype,"renderMenu",{writable:true,configurable:true,value:function(children) {"use strict";
	    var props = this.props;
	    var menuProps = {};
	    if (isMultipleOrTags(props)) {
	      menuProps.onDeselect = this.handleMenuDeselect;
	    }
	    var value = this.state.value;
	    var menuItems = React.Children.map(children, this.renderOption);
	    var selectedKeys = [];
	    React.Children.forEach(menuItems, function(item)  {
	      if (value.indexOf(item.props.value) !== -1) {
	        selectedKeys.push(item.key);
	      }
	    });
	    var activeKey;
	    if (selectedKeys.length === 1) {
	      activeKey = selectedKeys[0];
	    }
	    return React.createElement(Menu, React.__spread({
	      ref: "menu", 
	      onSelect: this.handleMenuSelect, 
	      activeFirst: true, 
	      activeKey: activeKey, 
	      multiple: isMultipleOrTags(props), 
	      focusable: false}, 
	      menuProps, 
	      {selectedKeys: selectedKeys, 
	      prefixCls: props.prefixCls + '-menu'}), 
	          menuItems
	    );
	  }});

	  Object.defineProperty(Select.prototype,"renderTopControlNode",{writable:true,configurable:true,value:function(input) {"use strict";
	    var value = this.state.value;
	    var prefixCls = this.props.prefixCls;
	    var allowClear = this.props.allowClear;
	    var clear = React.createElement("span", {className: prefixCls + '-selection__clear', 
	      onClick: this.handleClearSelection}, "×");
	    var props = this.props;
	    // single and not combobox, input is inside dropdown
	    if (!props.combobox && !isMultipleOrTags(props)) {
	      return React.createElement("span", {className: prefixCls + '-selection__rendered'}, 
	          value[0], 
	          allowClear ? clear : null
	      );
	    }
	    var selectedValueNodes;
	    if (isMultipleOrTags(props)) {
	      selectedValueNodes = value.map(function(v)  {
	        return (
	          React.createElement("li", {className: prefixCls + '-selection__choice'}, 
	            React.createElement("span", {className: prefixCls + '-selection__choice__remove', 
	              onClick: this.removeSelected.bind(this, v)
	            }, "×"), 
	           v
	          )
	        );
	      }.bind(this));
	    }
	    return (
	      React.createElement("ul", {className: prefixCls + '-selection__rendered'}, 
	          selectedValueNodes, 
	          allowClear && !isMultipleOrTags(props) ? clear : null, 
	        React.createElement("li", {className: joinClasses(prefixCls + '-search', prefixCls + '-search--inline')}, input)
	      )
	    );
	  }});

	  Object.defineProperty(Select.prototype,"renderRoot",{writable:true,configurable:true,value:function(children) {"use strict";
	    var props = this.props;
	    var prefixCls = props.prefixCls;
	    var rootCls = {};
	    rootCls[prefixCls] = true;
	    if (this.state.open) {
	      rootCls[prefixCls + '-open'] = true;
	    }
	    return (
	      React.createElement("span", {
	        style: props.style, 
	        className: joinClasses(props.className, classSet(rootCls)), dir: "ltr", 
	        onFocus: this.handleFocus, 
	        onBlur: this.handleBlur}, 
	        children
	      )
	    );
	  }});

	  Object.defineProperty(Select.prototype,"renderOption",{writable:true,configurable:true,value:function(child) {"use strict";
	    var props = getPropsFromOption(child);
	    return React.createElement(MenuItem, React.__spread({},  props), child.props.children);
	  }});

	  Object.defineProperty(Select.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var props = this.props;
	    var multiple = isMultipleOrTags(props);
	    var state = this.state;
	    var prefixCls = props.prefixCls;

	    var input = (
	      React.createElement("input", {ref: "input", 
	        onChange: this.handleInputChange, 
	        onKeyDown: this.handleInputKeyDown, 
	        value: state.inputValue, 
	        className: prefixCls + '-search__field', 
	        role: "textbox"})
	    );

	    var children = this.renderFilterOptions();
	    var ctrlNode = this.renderTopControlNode(input);
	    var dropDown;
	    if (state.open) {
	      // single and not combobox, input is inside dropdown
	      dropDown = React.createElement("span", {key: "dropdown", className: joinClasses(prefixCls + '-dropdown', prefixCls + '-dropdown--below'), tabIndex: "-1"}, 
	      multiple || props.combobox ? null : React.createElement("span", {className: joinClasses(prefixCls + '-search', prefixCls + '-search--dropdown')}, input), 
	        this.renderMenu(children)
	      );
	    }

	    var extraSelectionProps = {};
	    if (!props.combobox) {
	      extraSelectionProps = {
	        onKeyDown: this.handleKeyDown,
	        tabIndex: 0
	      };
	    }

	    return this.renderRoot([
	      React.createElement("span", React.__spread({ref: "selection", 
	        key: "selection", 
	        className: joinClasses(prefixCls + '-selection',
	          prefixCls + '-selection--' + (multiple ? 'multiple' : 'single')), 
	        role: "combobox", 
	        "aria-autocomplete": "list", 
	        onClick: this.handleClick, 
	        "aria-haspopup": "true", 
	        "aria-expanded": state.open}, 
	      extraSelectionProps
	      ), 
	        ctrlNode, 
	        multiple ? null :
	          React.createElement("span", {key: "arrow", className: prefixCls + '-arrow'}, 
	            React.createElement("b", null)
	          )
	      ),
	      dropDown
	    ]);
	  }});


	Select.propTypes = {
	  multiple: React.PropTypes.bool,
	  tags: React.PropTypes.bool,
	  onChange: React.PropTypes.func,
	  onSelect: React.PropTypes.func,
	  onDeselect: React.PropTypes.func
	};

	Select.defaultProps = {
	  prefixCls: 'rc-select',
	  filterOption: true,
	  allowClear: true,
	  onChange: noop,
	  onSelect: noop,
	  onDeselect: noop,
	  notFoundContent: 'Not Found'
	};

	module.exports = Select;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/**
	 * Option
	 */
	/*jshint -W079 */
	var React = __webpack_require__(6);

	var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){Option[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;Option.prototype=Object.create(____SuperProtoOf____Class1);Option.prototype.constructor=Option;Option.__superConstructor__=____Class1;function Option(){"use strict";if(____Class1!==null){____Class1.apply(this,arguments);}}



	module.exports = Option;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  guid: __webpack_require__(21),
	  classSet: __webpack_require__(22),
	  joinClasses: __webpack_require__(23),
	  KeyCode: __webpack_require__(24),
	  PureRenderMixin: __webpack_require__(25),
	  shallowEqual: __webpack_require__(26),
	  createChainedFunction: __webpack_require__(27),
	  Dom: {
	    addEventListener: __webpack_require__(28),
	    contains: __webpack_require__(29)
	  },
	  Children: {
	    toArray: __webpack_require__(30)
	  }
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Menu = __webpack_require__(31);
	Menu.SubMenu = __webpack_require__(32);
	Menu.Item = __webpack_require__(33);
	module.exports = Menu;


/***/ },
/* 20 */,
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var seed = 0;
	module.exports = function () {
	  return Date.now() + '_' + (seed++);
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/cx.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */

	/**
	 * This function is used to mark string literals representing CSS class names
	 * so that they can be transformed statically. This allows for modularization
	 * and minification of CSS class names.
	 *
	 * In static_upstream, this function is actually implemented, but it should
	 * eventually be replaced with something more descriptive, and the transform
	 * that is used in the main stack should be ported for use elsewhere.
	 *
	 * @param string|object className to modularize, or an object of key/values.
	 *                      In the object case, the values are conditions that
	 *                      determine if the className keys should be included.
	 * @param [string ...]  Variable list of classNames in the string case.
	 * @return string       Renderable space-separated CSS className.
	 */
	function cx(classNames) {
	  if (typeof classNames === 'object') {
	    return Object.keys(classNames).filter(function(className) {
	      return classNames[className];
	    }).join(' ');
	  } else {
	    return Array.prototype.join.call(arguments, ' ');
	  }
	}

	module.exports = cx;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This file contains an unmodified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/utils/joinClasses.js
	 *
	 * This source code is licensed under the BSD-style license found here:
	 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
	 * An additional grant of patent rights can be found here:
	 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
	 */

	"use strict";

	/**
	 * Combines multiple className strings into one.
	 * http://jsperf.com/joinclasses-args-vs-array
	 *
	 * @param {...?string} classes
	 * @return {string}
	 */

	function joinClasses(className /*, ... */ ) {
	  if (!className) {
	    className = '';
	  }
	  var nextClass;
	  var argLength = arguments.length;
	  if (argLength > 1) {
	    for (var ii = 1; ii < argLength; ii++) {
	      nextClass = arguments[ii];
	      if (nextClass) {
	        className = (className ? className + ' ' : '') + nextClass;
	      }
	    }
	  }
	  return className;
	}

	module.exports = joinClasses;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @ignore
	 * some key-codes definition and utils from closure-library
	 * @author yiminghe@gmail.com
	 */

	var KeyCode = {
	  /**
	   * MAC_ENTER
	   */
	  MAC_ENTER: 3,
	  /**
	   * BACKSPACE
	   */
	  BACKSPACE: 8,
	  /**
	   * TAB
	   */
	  TAB: 9,
	  /**
	   * NUMLOCK on FF/Safari Mac
	   */
	  NUM_CENTER: 12, // NUMLOCK on FF/Safari Mac
	  /**
	   * ENTER
	   */
	  ENTER: 13,
	  /**
	   * SHIFT
	   */
	  SHIFT: 16,
	  /**
	   * CTRL
	   */
	  CTRL: 17,
	  /**
	   * ALT
	   */
	  ALT: 18,
	  /**
	   * PAUSE
	   */
	  PAUSE: 19,
	  /**
	   * CAPS_LOCK
	   */
	  CAPS_LOCK: 20,
	  /**
	   * ESC
	   */
	  ESC: 27,
	  /**
	   * SPACE
	   */
	  SPACE: 32,
	  /**
	   * PAGE_UP
	   */
	  PAGE_UP: 33, // also NUM_NORTH_EAST
	  /**
	   * PAGE_DOWN
	   */
	  PAGE_DOWN: 34, // also NUM_SOUTH_EAST
	  /**
	   * END
	   */
	  END: 35, // also NUM_SOUTH_WEST
	  /**
	   * HOME
	   */
	  HOME: 36, // also NUM_NORTH_WEST
	  /**
	   * LEFT
	   */
	  LEFT: 37, // also NUM_WEST
	  /**
	   * UP
	   */
	  UP: 38, // also NUM_NORTH
	  /**
	   * RIGHT
	   */
	  RIGHT: 39, // also NUM_EAST
	  /**
	   * DOWN
	   */
	  DOWN: 40, // also NUM_SOUTH
	  /**
	   * PRINT_SCREEN
	   */
	  PRINT_SCREEN: 44,
	  /**
	   * INSERT
	   */
	  INSERT: 45, // also NUM_INSERT
	  /**
	   * DELETE
	   */
	  DELETE: 46, // also NUM_DELETE
	  /**
	   * ZERO
	   */
	  ZERO: 48,
	  /**
	   * ONE
	   */
	  ONE: 49,
	  /**
	   * TWO
	   */
	  TWO: 50,
	  /**
	   * THREE
	   */
	  THREE: 51,
	  /**
	   * FOUR
	   */
	  FOUR: 52,
	  /**
	   * FIVE
	   */
	  FIVE: 53,
	  /**
	   * SIX
	   */
	  SIX: 54,
	  /**
	   * SEVEN
	   */
	  SEVEN: 55,
	  /**
	   * EIGHT
	   */
	  EIGHT: 56,
	  /**
	   * NINE
	   */
	  NINE: 57,
	  /**
	   * QUESTION_MARK
	   */
	  QUESTION_MARK: 63, // needs localization
	  /**
	   * A
	   */
	  A: 65,
	  /**
	   * B
	   */
	  B: 66,
	  /**
	   * C
	   */
	  C: 67,
	  /**
	   * D
	   */
	  D: 68,
	  /**
	   * E
	   */
	  E: 69,
	  /**
	   * F
	   */
	  F: 70,
	  /**
	   * G
	   */
	  G: 71,
	  /**
	   * H
	   */
	  H: 72,
	  /**
	   * I
	   */
	  I: 73,
	  /**
	   * J
	   */
	  J: 74,
	  /**
	   * K
	   */
	  K: 75,
	  /**
	   * L
	   */
	  L: 76,
	  /**
	   * M
	   */
	  M: 77,
	  /**
	   * N
	   */
	  N: 78,
	  /**
	   * O
	   */
	  O: 79,
	  /**
	   * P
	   */
	  P: 80,
	  /**
	   * Q
	   */
	  Q: 81,
	  /**
	   * R
	   */
	  R: 82,
	  /**
	   * S
	   */
	  S: 83,
	  /**
	   * T
	   */
	  T: 84,
	  /**
	   * U
	   */
	  U: 85,
	  /**
	   * V
	   */
	  V: 86,
	  /**
	   * W
	   */
	  W: 87,
	  /**
	   * X
	   */
	  X: 88,
	  /**
	   * Y
	   */
	  Y: 89,
	  /**
	   * Z
	   */
	  Z: 90,
	  /**
	   * META
	   */
	  META: 91, // WIN_KEY_LEFT
	  /**
	   * WIN_KEY_RIGHT
	   */
	  WIN_KEY_RIGHT: 92,
	  /**
	   * CONTEXT_MENU
	   */
	  CONTEXT_MENU: 93,
	  /**
	   * NUM_ZERO
	   */
	  NUM_ZERO: 96,
	  /**
	   * NUM_ONE
	   */
	  NUM_ONE: 97,
	  /**
	   * NUM_TWO
	   */
	  NUM_TWO: 98,
	  /**
	   * NUM_THREE
	   */
	  NUM_THREE: 99,
	  /**
	   * NUM_FOUR
	   */
	  NUM_FOUR: 100,
	  /**
	   * NUM_FIVE
	   */
	  NUM_FIVE: 101,
	  /**
	   * NUM_SIX
	   */
	  NUM_SIX: 102,
	  /**
	   * NUM_SEVEN
	   */
	  NUM_SEVEN: 103,
	  /**
	   * NUM_EIGHT
	   */
	  NUM_EIGHT: 104,
	  /**
	   * NUM_NINE
	   */
	  NUM_NINE: 105,
	  /**
	   * NUM_MULTIPLY
	   */
	  NUM_MULTIPLY: 106,
	  /**
	   * NUM_PLUS
	   */
	  NUM_PLUS: 107,
	  /**
	   * NUM_MINUS
	   */
	  NUM_MINUS: 109,
	  /**
	   * NUM_PERIOD
	   */
	  NUM_PERIOD: 110,
	  /**
	   * NUM_DIVISION
	   */
	  NUM_DIVISION: 111,
	  /**
	   * F1
	   */
	  F1: 112,
	  /**
	   * F2
	   */
	  F2: 113,
	  /**
	   * F3
	   */
	  F3: 114,
	  /**
	   * F4
	   */
	  F4: 115,
	  /**
	   * F5
	   */
	  F5: 116,
	  /**
	   * F6
	   */
	  F6: 117,
	  /**
	   * F7
	   */
	  F7: 118,
	  /**
	   * F8
	   */
	  F8: 119,
	  /**
	   * F9
	   */
	  F9: 120,
	  /**
	   * F10
	   */
	  F10: 121,
	  /**
	   * F11
	   */
	  F11: 122,
	  /**
	   * F12
	   */
	  F12: 123,
	  /**
	   * NUMLOCK
	   */
	  NUMLOCK: 144,
	  /**
	   * SEMICOLON
	   */
	  SEMICOLON: 186, // needs localization
	  /**
	   * DASH
	   */
	  DASH: 189, // needs localization
	  /**
	   * EQUALS
	   */
	  EQUALS: 187, // needs localization
	  /**
	   * COMMA
	   */
	  COMMA: 188, // needs localization
	  /**
	   * PERIOD
	   */
	  PERIOD: 190, // needs localization
	  /**
	   * SLASH
	   */
	  SLASH: 191, // needs localization
	  /**
	   * APOSTROPHE
	   */
	  APOSTROPHE: 192, // needs localization
	  /**
	   * SINGLE_QUOTE
	   */
	  SINGLE_QUOTE: 222, // needs localization
	  /**
	   * OPEN_SQUARE_BRACKET
	   */
	  OPEN_SQUARE_BRACKET: 219, // needs localization
	  /**
	   * BACKSLASH
	   */
	  BACKSLASH: 220, // needs localization
	  /**
	   * CLOSE_SQUARE_BRACKET
	   */
	  CLOSE_SQUARE_BRACKET: 221, // needs localization
	  /**
	   * WIN_KEY
	   */
	  WIN_KEY: 224,
	  /**
	   * MAC_FF_META
	   */
	  MAC_FF_META: 224, // Firefox (Gecko) fires this for the meta key instead of 91
	  /**
	   * WIN_IME
	   */
	  WIN_IME: 229
	};

	/*
	 whether text and modified key is entered at the same time.
	 */
	KeyCode.isTextModifyingKeyEvent = function (e) {
	  var keyCode = e.keyCode;
	  if (e.altKey && !e.ctrlKey || e.metaKey ||
	      // Function keys don't generate text
	    keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
	    return false;
	  }

	  // The following keys are quite harmless, even in combination with
	  // CTRL, ALT or SHIFT.
	  switch (keyCode) {
	    case KeyCode.ALT:
	    case KeyCode.CAPS_LOCK:
	    case KeyCode.CONTEXT_MENU:
	    case KeyCode.CTRL:
	    case KeyCode.DOWN:
	    case KeyCode.END:
	    case KeyCode.ESC:
	    case KeyCode.HOME:
	    case KeyCode.INSERT:
	    case KeyCode.LEFT:
	    case KeyCode.MAC_FF_META:
	    case KeyCode.META:
	    case KeyCode.NUMLOCK:
	    case KeyCode.NUM_CENTER:
	    case KeyCode.PAGE_DOWN:
	    case KeyCode.PAGE_UP:
	    case KeyCode.PAUSE:
	    case KeyCode.PRINT_SCREEN:
	    case KeyCode.RIGHT:
	    case KeyCode.SHIFT:
	    case KeyCode.UP:
	    case KeyCode.WIN_KEY:
	    case KeyCode.WIN_KEY_RIGHT:
	      return false;
	    default:
	      return true;
	  }
	};

	/*
	 whether character is entered.
	 */
	KeyCode.isCharacterKey = function (keyCode) {
	  if (keyCode >= KeyCode.ZERO &&
	    keyCode <= KeyCode.NINE) {
	    return true;
	  }

	  if (keyCode >= KeyCode.NUM_ZERO &&
	    keyCode <= KeyCode.NUM_MULTIPLY) {
	    return true;
	  }

	  if (keyCode >= KeyCode.A &&
	    keyCode <= KeyCode.Z) {
	    return true;
	  }

	  // Safari sends zero key code for non-latin characters.
	  if (window.navigation.userAgent.indexOf('WebKit') !== -1 && keyCode === 0) {
	    return true;
	  }

	  switch (keyCode) {
	    case KeyCode.SPACE:
	    case KeyCode.QUESTION_MARK:
	    case KeyCode.NUM_PLUS:
	    case KeyCode.NUM_MINUS:
	    case KeyCode.NUM_PERIOD:
	    case KeyCode.NUM_DIVISION:
	    case KeyCode.SEMICOLON:
	    case KeyCode.DASH:
	    case KeyCode.EQUALS:
	    case KeyCode.COMMA:
	    case KeyCode.PERIOD:
	    case KeyCode.SLASH:
	    case KeyCode.APOSTROPHE:
	    case KeyCode.SINGLE_QUOTE:
	    case KeyCode.OPEN_SQUARE_BRACKET:
	    case KeyCode.BACKSLASH:
	    case KeyCode.CLOSE_SQUARE_BRACKET:
	      return true;
	    default:
	      return false;
	  }
	};

	module.exports = KeyCode;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule ReactComponentWithPureRenderMixin
	*/

	"use strict";

	var shallowEqual = __webpack_require__(26);

	/**
	 * If your React component's render function is "pure", e.g. it will render the
	 * same result given the same props and state, provide this Mixin for a
	 * considerable performance boost.
	 *
	 * Most React components have pure render functions.
	 *
	 * Example:
	 *
	 *   var ReactComponentWithPureRenderMixin =
	 *     require('ReactComponentWithPureRenderMixin');
	 *   React.createClass({
	 *     mixins: [ReactComponentWithPureRenderMixin],
	 *
	 *     render: function() {
	 *       return <div className={this.props.className}>foo</div>;
	 *     }
	 *   });
	 *
	 * Note: This only checks shallow equality for props and state. If these contain
	 * complex data structures this mixin may have false-negatives for deeper
	 * differences. Only mixin to components which have simple props and state, or
	 * use `forceUpdate()` when you know deep data structures have changed.
	 */
	var ReactComponentWithPureRenderMixin = {
	  shouldComponentUpdate: function(nextProps, nextState) {
	    return !shallowEqual(this.props, nextProps) ||
	           !shallowEqual(this.state, nextState);
	  }
	};

	module.exports = ReactComponentWithPureRenderMixin;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shallowEqual
	 */

	"use strict";

	/**
	 * Performs equality by iterating through keys on an object and returning
	 * false when any key has values which are not strictly equal between
	 * objA and objB. Returns true when the values of all keys are strictly equal.
	 *
	 * @return {boolean}
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	  var key;
	  // Test for A's keys different from B.
	  for (key in objA) {
	    if (objA.hasOwnProperty(key) &&
	        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
	      return false;
	    }
	  }
	  // Test for B's keys missing from A.
	  for (key in objB) {
	    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = shallowEqual;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @returns {function|null}
	 */
	function createChainedFunction() {
	  var args = arguments;

	  return function chainedFunction() {
	    for (var i = 0; i < args.length; i++) {
	      if (args[i] && args[i].apply) {
	        args[i].apply(this, arguments);
	      }
	    }
	  };
	}

	module.exports = createChainedFunction;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (target, eventType, callback) {
	  if (target.addEventListener) {
	    target.addEventListener(eventType, callback, false);
	    return {
	      remove: function () {
	        target.removeEventListener(eventType, callback, false);
	      }
	    };
	  } else if (target.attachEvent) {
	    target.attachEvent('on' + eventType, callback);
	    return {
	      remove: function () {
	        target.detachEvent('on' + eventType, callback);
	      }
	    };
	  }
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (root, node) {
	  while (node) {
	    if (node === root) {
	      return true;
	    }
	    node = node.parentNode;
	  }

	  return false;
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(6);

	module.exports = function (children) {
	  var ret = [];
	  React.Children.forEach(children, function (c) {
	    ret.push(c);
	  });
	  return ret;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(6);
	var rcUtil = __webpack_require__(18);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	var createChainedFunction = rcUtil.createChainedFunction;
	var assign = __webpack_require__(36);
	var KeyCode = rcUtil.KeyCode;
	var scrollIntoView = __webpack_require__(37);

	function getActiveKey(props) {
	  var activeKey = props.activeKey;
	  var children = props.children;
	  React.Children.forEach(children, function(c)  {
	    if (!c.key && !c.props.disabled) {
	      throw new Error('MenuItem must have key!');
	    }
	  });
	  if (activeKey) {
	    return activeKey;
	  }
	  React.Children.forEach(children, function(c) {
	    if (c.props.active) {
	      activeKey = c.key;
	    }
	  });
	  if (!activeKey && props.activeFirst) {
	    React.Children.forEach(children, function(c) {
	      if (!activeKey && !c.props.disabled) {
	        activeKey = c.key;
	      }
	    });
	    return activeKey;
	  }
	  return activeKey;
	}

	function saveRef(name, c) {
	  this.instances = this.instances || {};
	  this.instances[name] = c;
	}

	var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){Menu[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;Menu.prototype=Object.create(____SuperProtoOf____Class2);Menu.prototype.constructor=Menu;Menu.__superConstructor__=____Class2;
	  function Menu(props) {"use strict";
	    ____Class2.call(this,props);
	    this.state = {
	      activeKey: getActiveKey.call(this, props),
	      selectedKeys: props.selectedKeys || []
	    };

	    ['handleItemHover', 'handleDeselect', 'handleSelect', 'handleKeyDown', 'handleDestroy'].forEach(function(m) {
	      this[m] = this[m].bind(this);
	    }.bind(this));
	  }

	  Object.defineProperty(Menu.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function(nextProps) {"use strict";
	    this.setState({
	      activeKey: getActiveKey.call(this, nextProps),
	      selectedKeys: nextProps.selectedKeys || []
	    });
	  }});

	  Object.defineProperty(Menu.prototype,"getChildrenComponents",{writable:true,configurable:true,value:function() {"use strict";
	    var ret = [];
	    this.newChildren.forEach(function(c) {
	      ret.push(this.instances[c.key]);
	    }.bind(this));
	    return ret;
	  }});

	  // all keyboard events callbacks run from here at first
	  Object.defineProperty(Menu.prototype,"handleKeyDown",{writable:true,configurable:true,value:function(e) {"use strict";
	    var keyCode = e.keyCode;
	    var handled;
	    this.newChildren.forEach(function(c) {
	      var obj = this.instances[c.key];
	      if (c.props.active) {
	        handled = obj.handleKeyDown(e);
	      }
	    }.bind(this));
	    if (handled) {
	      return true;
	    }
	    var activeKey;
	    switch (keyCode) {
	      case KeyCode.UP: //up
	        activeKey = this.step(-1);
	        break;
	      case KeyCode.DOWN: //down
	        activeKey = this.step(1);
	        break;
	    }
	    if (activeKey) {
	      e.preventDefault();
	      this.setState({
	        activeKey: activeKey
	      }, function() {
	        scrollIntoView(React.findDOMNode(this.instances[activeKey]), React.findDOMNode(this), {
	          onlyScrollIfNeeded: true
	        });
	      }.bind(this));
	      return true;
	    }
	  }});

	  Object.defineProperty(Menu.prototype,"step",{writable:true,configurable:true,value:function(direction) {"use strict";
	    var children = this.newChildren;
	    var activeKey = this.state.activeKey;
	    var len = children.length;
	    if (direction < 0) {
	      children = children.concat().reverse();
	    }
	    // find current activeIndex
	    var activeIndex = -1;
	    children.every(function(c, i) {
	      if (c.key === activeKey) {
	        activeIndex = i;
	        return false;
	      }
	      return true;
	    });
	    var start = (activeIndex + 1) % len;
	    var i = start;
	    while (1) {
	      var child = children[i];
	      var key = child.key;
	      if (child.props.disabled) {
	        i = (i + 1 + len) % len;
	        // complete a loop
	        if (i === start) {
	          return null;
	        }
	      } else {
	        return key;
	      }
	    }
	  }});

	  Object.defineProperty(Menu.prototype,"handleItemHover",{writable:true,configurable:true,value:function(key) {"use strict";
	    this.setState({
	      activeKey: key
	    });
	  }});

	  Object.defineProperty(Menu.prototype,"handleSelect",{writable:true,configurable:true,value:function(key, child, e) {"use strict";
	    var props = this.props;
	    // not from submenu
	    if (!props.sub) {
	      if (!props.multiple) {
	        var selectedDescendant = this.selectedDescendant;
	        if (selectedDescendant) {
	          if (selectedDescendant !== child) {
	            var selectedDescendantProps = selectedDescendant.props;
	            selectedDescendantProps.onDeselect(selectedDescendantProps.eventKey, selectedDescendant, e);
	          }
	        }
	        this.selectedDescendant = child;
	      }
	    }
	    var state = this.state;
	    var selectedKeys = state.selectedKeys;
	    // my child
	    if (this.getChildrenComponents().indexOf(child) !== -1) {
	      if (props.multiple) {
	        selectedKeys.push(key);
	      } else {
	        state.selectedKeys = [key];
	      }
	      this.setState({
	        selectedKeys: state.selectedKeys
	      });
	    }
	    if (props.onSelect) {
	      props.onSelect(key, child, e);
	    }
	  }});

	  Object.defineProperty(Menu.prototype,"handleDeselect",{writable:true,configurable:true,value:function(key, child, e) {"use strict";
	    var state = this.state;
	    var selectedKeys = state.selectedKeys;
	    // my children
	    if (this.getChildrenComponents().indexOf(child) !== -1) {
	      var index = selectedKeys.indexOf(key);
	      if (index !== -1) {
	        selectedKeys.splice(index, 1);
	        this.setState({
	          selectedKeys: state.selectedKeys
	        });
	      }
	    }
	    if (this.props.onDeselect) {
	      this.props.onDeselect(key, child, e);
	    }
	  }});

	  Object.defineProperty(Menu.prototype,"handleDestroy",{writable:true,configurable:true,value:function(key) {"use strict";
	    var state = this.state;
	    var selectedKeys = state.selectedKeys;
	    var index = selectedKeys.indexOf(key);
	    if (index !== -1) {
	      selectedKeys.splice(index, 1);
	      this.setState({
	        selectedKeys: state.selectedKeys
	      });
	    }
	  }});

	  Object.defineProperty(Menu.prototype,"renderMenuItem",{writable:true,configurable:true,value:function(child) {"use strict";
	    var key = child.key;
	    var state = this.state;
	    var props = this.props;
	    var baseProps = {
	      rootPrefixCls: props.prefixCls,
	      ref: createChainedFunction(child.ref, saveRef.bind(this, key)),
	      eventKey: key
	    };
	    var childProps = child.props;
	    if (childProps.disabled) {
	      return React.cloneElement(child, baseProps);
	    }
	    var newProps = {
	      onHover: this.handleItemHover,
	      active: key === state.activeKey,
	      multiple: props.multiple,
	      selected: state.selectedKeys.indexOf(key) !== -1,
	      onDeselect: createChainedFunction(childProps.onDeselect, this.handleDeselect),
	      onDestroy: this.handleDestroy,
	      onSelect: createChainedFunction(childProps.onSelect, this.handleSelect)
	    };
	    assign(newProps, baseProps);
	    return React.cloneElement(child, newProps);
	  }});

	  Object.defineProperty(Menu.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var props = this.props;
	    var classes = {};
	    classes[props.prefixCls] = true;
	    var domProps = {
	      className: joinClasses(props.className, classSet(classes)),
	      role: "menu",
	      "aria-activedescendant": ""
	    };
	    if (props.id) {
	      domProps.id = props.id;
	    }
	    if (props.focusable) {
	      domProps.tabIndex = '0';
	      domProps.onKeyDown = this.handleKeyDown;
	    }

	    this.newChildren = rcUtil.Children.toArray(props.children).map(this.renderMenuItem, this);
	    return (
	      React.createElement("ul", React.__spread({}, 
	        domProps), 
	      this.newChildren
	      )
	    );
	  }});


	Menu.propTypes = {
	  focusable: React.PropTypes.bool,
	  multiple: React.PropTypes.bool,
	  onSelect: React.PropTypes.func,
	  onDeselect: React.PropTypes.func,
	  activeFirst: React.PropTypes.bool,
	  activeKey: React.PropTypes.string,
	  selectedKeys: React.PropTypes.arrayOf(React.PropTypes.string)
	};

	Menu.defaultProps = {
	  prefixCls: 'rc-menu',
	  focusable: true
	};

	module.exports = Menu;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(6);
	var rcUtil = __webpack_require__(18);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	var guid = rcUtil.guid;
	var KeyCode = rcUtil.KeyCode;
	var Menu = __webpack_require__(31);
	var createChainedFunction = rcUtil.createChainedFunction;

	var SubMenu = React.createClass({displayName: "SubMenu",
	  propTypes: {
	    openOnHover: React.PropTypes.bool,
	    title: React.PropTypes.node,
	    onClick: React.PropTypes.func
	  },

	  mixins: [__webpack_require__(35)],

	  getInitialState:function() {
	    return {
	      activeFirst: false
	    };
	  },

	  saveMenuInstance:function(c) {
	    this.menuInstance = c;
	  },

	  _getPrefixCls:function() {
	    return this.props.rootPrefixCls + '-submenu';
	  },

	  _getActiveClassName:function() {
	    return this.props.activeClassName || this.props.rootPrefixCls + '-submenu-active';
	  },

	  _getDisabledClassName:function() {
	    return this.props.disabledClassName || this.props.rootPrefixCls + '-submenu-disabled';
	  },

	  componentWillReceiveProps:function(nextProps) {
	    if (!nextProps.active) {
	      this.setOpenState(false);
	    }
	  },

	  getDefaultProps:function() {
	    return {
	      openOnHover: true,
	      onMouseEnter:function() {
	      },
	      title: ''
	    };
	  },

	  handleKeyDown:function(e) {
	    var keyCode = e.keyCode;
	    var menu = this.menuInstance;

	    if (keyCode === KeyCode.ENTER) {
	      this.handleClick(e);
	      this.setState({
	        activeFirst: true
	      });
	      return true;
	    }

	    if (keyCode === KeyCode.RIGHT) {
	      if (this.state.open) {
	        menu.handleKeyDown(e);
	      } else {
	        this.setOpenState(true);
	        this.setState({
	          activeFirst: true
	        });
	      }
	      return true;
	    }
	    if (keyCode === KeyCode.LEFT) {
	      var handled;
	      if (this.state.open) {
	        handled = menu.handleKeyDown(e);
	      } else {
	        return;
	      }
	      if (!handled) {
	        this.setOpenState(false);
	        handled = true;
	      }
	      return handled;
	    }

	    if (this.state.open && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
	      return menu.handleKeyDown(e);
	    }
	  },

	  handleMouseEnter:function() {
	    var props = this.props;
	    props.onHover(props.eventKey);
	    if (props.openOnHover) {
	      this.setOpenState(true);
	      this.setState({
	        activeFirst: false
	      });
	    }
	  },

	  handleMouseLeave:function() {
	    if (!this.state.open) {
	      this.props.onHover(null);
	    }
	  },

	  handleClick:function() {
	    this.setOpenState(true);
	    this.setState({
	      activeFirst: false
	    });
	  },

	  handleSelect:function(childKey, child, e) {
	    this.props.onSelect(childKey, child, e);
	  },

	  handleDeselect:function(childKey, child, e) {
	    this.props.onDeselect(childKey, child, e);
	  },

	  render:function() {
	    var props = this.props;
	    var classes = {};
	    var prefixCls = this._getPrefixCls();
	    classes[this._getOpenClassName()] = this.state.open;
	    classes[this._getActiveClassName()] = props.active;
	    classes[this._getDisabledClassName()] = props.disabled;
	    this._menuId = this._menuId || guid();
	    classes[prefixCls] = true;
	    var clickEvents = {};
	    var mouseEvents = {};
	    var titleMouseEvents = {};
	    if (!props.disabled) {
	      clickEvents = {
	        onClick: this.handleClick
	      };
	      mouseEvents = {
	        onMouseLeave: this.handleMouseLeave
	      };
	      // only works in title, not outer li
	      titleMouseEvents = {
	        onMouseEnter: this.handleMouseEnter
	      };
	    }
	    return (
	      React.createElement("li", React.__spread({className: joinClasses(props.className, classSet(classes))},   mouseEvents), 
	        React.createElement("div", React.__spread({
	          className: prefixCls + '-title'}, 
	          titleMouseEvents, 
	          clickEvents, 
	          {"aria-expanded": props.active, 
	          "aria-owns": this._menuId, 
	          "aria-haspopup": "true"
	        }), 
	        props.title
	        ), 
	          this.renderChildren(props.children)
	      )
	    );
	  },
	  renderChildren:function(children) {
	    if (!this.state.open) {
	      // prevent destroy
	      return this._cacheMenu || null;
	    }
	    var childrenCount = React.Children.count(children);
	    var baseProps = {
	      sub: true,
	      focusable: false,
	      onSelect: this.handleSelect,
	      onDeselect: this.handleDeselect,
	      activeFirst: this.state.activeFirst,
	      multiple: this.props.multiple,
	      id: this._menuId,
	      ref: this.saveMenuInstance
	    };
	    if (this.menuInstance) {
	      baseProps.selectedKeys = this.menuInstance.state.selectedKeys;
	    }
	    if (childrenCount === 1 && children.type === Menu) {
	      var menu = children;
	      baseProps.ref = createChainedFunction(menu.ref, this.saveMenuInstance);
	      this._cacheMenu = React.cloneElement(menu, baseProps);
	    } else {
	      this._cacheMenu = React.createElement(Menu, React.__spread({},  baseProps), children);
	    }
	    return this._cacheMenu;
	  }
	});

	module.exports = SubMenu;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(6);
	var rcUtil = __webpack_require__(18);
	var joinClasses = rcUtil.joinClasses;
	var classSet = rcUtil.classSet;
	var KeyCode = rcUtil.KeyCode;

	var ____Class3=React.Component;for(var ____Class3____Key in ____Class3){if(____Class3.hasOwnProperty(____Class3____Key)){MenuItem[____Class3____Key]=____Class3[____Class3____Key];}}var ____SuperProtoOf____Class3=____Class3===null?null:____Class3.prototype;MenuItem.prototype=Object.create(____SuperProtoOf____Class3);MenuItem.prototype.constructor=MenuItem;MenuItem.__superConstructor__=____Class3;
	  function MenuItem(props) {"use strict";
	    ____Class3.call(this,props);
	    ['handleKeyDown', 'handleMouseLeave', 'handleMouseEnter', 'handleClick'].forEach(function(m) {
	      this[m] = this[m].bind(this);
	    }.bind(this));
	  }

	  Object.defineProperty(MenuItem.prototype,"$MenuItem_getActiveClassName",{writable:true,configurable:true,value:function() {"use strict";
	    return this.props.activeClassName || this.props.rootPrefixCls + '-item-active';
	  }});

	  Object.defineProperty(MenuItem.prototype,"$MenuItem_getSelectedClassName",{writable:true,configurable:true,value:function() {"use strict";
	    return this.props.activeClassName || this.props.rootPrefixCls + '-item-selected';
	  }});

	  Object.defineProperty(MenuItem.prototype,"$MenuItem_getPrefixCls",{writable:true,configurable:true,value:function() {"use strict";
	    return this.props.rootPrefixCls + '-item';
	  }});

	  Object.defineProperty(MenuItem.prototype,"$MenuItem_getDisabledClassName",{writable:true,configurable:true,value:function() {"use strict";
	    return this.props.disabledClassName || this.props.rootPrefixCls + '-item-disabled';
	  }});

	  Object.defineProperty(MenuItem.prototype,"handleKeyDown",{writable:true,configurable:true,value:function(e) {"use strict";
	    var keyCode = e.keyCode;
	    if (keyCode === KeyCode.ENTER) {
	      this.handleClick(e);
	      return true;
	    }
	  }});

	  Object.defineProperty(MenuItem.prototype,"handleMouseLeave",{writable:true,configurable:true,value:function() {"use strict";
	    this.props.onHover(null);
	  }});

	  Object.defineProperty(MenuItem.prototype,"handleMouseEnter",{writable:true,configurable:true,value:function() {"use strict";
	    var props = this.props;
	    props.onHover(props.eventKey);
	  }});

	  Object.defineProperty(MenuItem.prototype,"handleClick",{writable:true,configurable:true,value:function(e) {"use strict";
	    var props = this.props;
	    if (props.multiple) {
	      if (props.selected) {
	        props.onDeselect(props.eventKey, this, e);
	      } else {
	        props.onSelect(props.eventKey, this,e);
	      }
	    } else {
	      if (!props.selected) {
	        props.onSelect(props.eventKey, this,e);
	      }
	    }
	  }});

	  Object.defineProperty(MenuItem.prototype,"componentWillUnmount",{writable:true,configurable:true,value:function() {"use strict";
	    var props = this.props;
	    if (props.onDestroy) {
	      props.onDestroy(props.eventKey);
	    }
	  }});

	  Object.defineProperty(MenuItem.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var props = this.props;
	    var classes = {};
	    classes[this.$MenuItem_getActiveClassName()] = !props.disabled && props.active;
	    classes[this.$MenuItem_getSelectedClassName()] = props.selected;
	    classes[this.$MenuItem_getDisabledClassName()] = props.disabled;
	    classes[this.$MenuItem_getPrefixCls()] = true;
	    var attrs = {
	      title: props.title,
	      className: joinClasses(props.className, classSet(classes)),
	      role: "menuitem",
	      "aria-selected": props.selected,
	      "aria-disabled": props.disabled
	    };
	    var mouseEvent = {};
	    if (!props.disabled) {
	      mouseEvent = {
	        onClick: this.handleClick,
	        onMouseLeave: this.handleMouseLeave,
	        onMouseEnter: this.handleMouseEnter
	      };
	    }
	    return (
	      React.createElement("li", React.__spread({}, 
	        attrs, 
	        mouseEvent), 
	      props.children
	      )
	    );
	  }});


	MenuItem.propTypes = {
	  active: React.PropTypes.bool,
	  selected: React.PropTypes.bool,
	  disabled: React.PropTypes.bool,
	  title: React.PropTypes.string,
	  onSelect: React.PropTypes.func,
	  onDeselect: React.PropTypes.func,
	  onHover: React.PropTypes.func,
	  onDestroy: React.PropTypes.func
	};

	MenuItem.defaultProps = {
	  onSelect:function() {
	  },
	  onMouseEnter:function() {
	  }
	};
	module.exports = MenuItem;


/***/ },
/* 34 */,
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var rcUtil = __webpack_require__(18);
	var KeyCode = rcUtil.KeyCode;
	var React = __webpack_require__(6);

	var SubMenuStateMixin = {
	  getInitialState:function() {
	    return {
	      open: this.props.open || false
	    };
	  },

	  _getOpenClassName:function() {
	    return this.props.openClassName || this.props.rootPrefixCls + '-submenu-open';
	  },

	  setOpenState:function(newState, onStateChangeComplete) {
	    if (newState) {
	      this.bindRootCloseHandlers();
	    } else {
	      this.unbindRootCloseHandlers();
	    }

	    this.setState({
	      open: newState
	    }, onStateChangeComplete);
	  },

	  handleDocumentKeyUp:function(e) {
	    if (e.keyCode === KeyCode.ESC) {
	      this.setOpenState(false);
	    }
	  },

	  handleDocumentClick:function(e) {
	    // If the click originated from within this component
	    // don't do anything.
	    if (rcUtil.Dom.contains(React.findDOMNode(this), e.target)) {
	      return;
	    }
	    // de active menu cause sub menu hide its menu
	    this.props.onHover(null);
	  },

	  bindRootCloseHandlers:function() {
	    this._onDocumentClickListener = rcUtil.Dom.addEventListener(document, 'click', this.handleDocumentClick);
	    this._onDocumentKeyupListener = rcUtil.Dom.addEventListener(document, 'keyup', this.handleDocumentKeyUp);
	  },

	  unbindRootCloseHandlers:function() {
	    if (this._onDocumentClickListener) {
	      this._onDocumentClickListener.remove();
	    }

	    if (this._onDocumentKeyupListener) {
	      this._onDocumentKeyupListener.remove();
	    }
	  },

	  componentWillUnmount:function() {
	    this.unbindRootCloseHandlers();
	  }
	};

	module.exports = SubMenuStateMixin;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(39);


/***/ },
/* 38 */,
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(40);

	function scrollIntoView(elem, container, config) {
	  config = config || {};
	  // document 归一化到 window
	  if (container.nodeType === 9) {
	    container = util.getWindow(container);
	  }

	  var allowHorizontalScroll = config.allowHorizontalScroll;
	  var onlyScrollIfNeeded = config.onlyScrollIfNeeded;
	  var alignWithTop = config.alignWithTop;
	  var alignWithLeft = config.alignWithLeft;

	  allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;

	  var isWin = util.isWindow(container);
	  var elemOffset = util.offset(elem);
	  var eh = util.outerHeight(elem);
	  var ew = util.outerWidth(elem);
	  var containerOffset, ch, cw, containerScroll,
	    diffTop, diffBottom, win,
	    winScroll, ww, wh;

	  if (isWin) {
	    win = container;
	    wh = util.height(win);
	    ww = util.width(win);
	    winScroll = {
	      left: util.scrollLeft(win),
	      top: util.scrollTop(win)
	    };
	    // elem 相对 container 可视视窗的距离
	    diffTop = {
	      left: elemOffset.left - winScroll.left,
	      top: elemOffset.top - winScroll.top
	    };
	    diffBottom = {
	      left: elemOffset.left + ew - (winScroll.left + ww),
	      top: elemOffset.top + eh - (winScroll.top + wh)
	    };
	    containerScroll = winScroll;
	  } else {
	    containerOffset = util.offset(container);
	    ch = container.clientHeight;
	    cw = container.clientWidth;
	    containerScroll = {
	      left: container.scrollLeft,
	      top: container.scrollTop
	    };
	    // elem 相对 container 可视视窗的距离
	    // 注意边框, offset 是边框到根节点
	    diffTop = {
	      left: elemOffset.left - (containerOffset.left +
	      (parseFloat(util.css(container, 'borderLeftWidth')) || 0)),
	      top: elemOffset.top - (containerOffset.top +
	      (parseFloat(util.css(container, 'borderTopWidth')) || 0))
	    };
	    diffBottom = {
	      left: elemOffset.left + ew -
	      (containerOffset.left + cw +
	      (parseFloat(util.css(container, 'borderRightWidth')) || 0)),
	      top: elemOffset.top + eh -
	      (containerOffset.top + ch +
	      (parseFloat(util.css(container, 'borderBottomWidth')) || 0))
	    };
	  }

	  if (diffTop.top < 0 || diffBottom.top > 0) {
	    // 强制向上
	    if (alignWithTop === true) {
	      util.scrollTop(container, containerScroll.top + diffTop.top);
	    } else if (alignWithTop === false) {
	      util.scrollTop(container, containerScroll.top + diffBottom.top);
	    } else {
	      // 自动调整
	      if (diffTop.top < 0) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  } else {
	    if (!onlyScrollIfNeeded) {
	      alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
	      if (alignWithTop) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  }

	  if (allowHorizontalScroll) {
	    if (diffTop.left < 0 || diffBottom.left > 0) {
	      // 强制向上
	      if (alignWithLeft === true) {
	        util.scrollLeft(container, containerScroll.left + diffTop.left);
	      } else if (alignWithLeft === false) {
	        util.scrollLeft(container, containerScroll.left + diffBottom.left);
	      } else {
	        // 自动调整
	        if (diffTop.left < 0) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    } else {
	      if (!onlyScrollIfNeeded) {
	        alignWithLeft = alignWithLeft === undefined ? true : !!alignWithLeft;
	        if (alignWithLeft) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    }
	  }
	}

	module.exports = scrollIntoView;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;

	function getClientPosition(elem) {
	  var box, x, y;
	  var doc = elem.ownerDocument;
	  var body = doc.body;
	  var docElem = doc && doc.documentElement;
	  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
	  box = elem.getBoundingClientRect();

	  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
	  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
	  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

	  x = box.left;
	  y = box.top;

	  // In IE, most of the time, 2 extra pixels are added to the top and left
	  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
	  // IE6 standards mode, this border can be overridden by setting the
	  // document element's border to zero -- thus, we cannot rely on the
	  // offset always being 2 pixels.

	  // In quirks mode, the offset can be determined by querying the body's
	  // clientLeft/clientTop, but in standards mode, it is found by querying
	  // the document element's clientLeft/clientTop.  Since we already called
	  // getClientBoundingRect we have already forced a reflow, so it is not
	  // too expensive just to query them all.

	  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
	  // 窗口边框标准是设 documentElement ,quirks 时设置 body
	  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
	  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
	  // 标准 ie 下 docElem.clientTop 就是 border-top
	  // ie7 html 即窗口边框改变不了。永远为 2
	  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

	  x -= docElem.clientLeft || body.clientLeft || 0;
	  y -= docElem.clientTop || body.clientTop || 0;

	  return {left: x, top: y};
	}

	function getScroll(w, top) {
	  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
	  var method = 'scroll' + (top ? 'Top' : 'Left');
	  if (typeof ret !== 'number') {
	    var d = w.document;
	    //ie6,7,8 standard mode
	    ret = d.documentElement[method];
	    if (typeof ret !== 'number') {
	      //quirks mode
	      ret = d.body[method];
	    }
	  }
	  return ret;
	}

	function getScrollLeft(w) {
	  return getScroll(w);
	}

	function getScrollTop(w) {
	  return getScroll(w, true);
	}

	function getOffset(el) {
	  var pos = getClientPosition(el);
	  var doc = el.ownerDocument;
	  var w = doc.defaultView || doc.parentWindow;
	  pos.left += getScrollLeft(w);
	  pos.top += getScrollTop(w);
	  return pos;
	}
	function _getComputedStyle(elem, name, computedStyle) {
	  var val = '';
	  var d = elem.ownerDocument;

	  // https://github.com/kissyteam/kissy/issues/61
	  if ((computedStyle = (computedStyle || d.defaultView.getComputedStyle(elem, null)))) {
	    val = computedStyle.getPropertyValue(name) || computedStyle[name];
	  }

	  return val;
	}

	var _RE_NUM_NO_PX = new RegExp('^(' + RE_NUM + ')(?!px)[a-z%]+$', 'i');
	var RE_POS = /^(top|right|bottom|left)$/,
	  CURRENT_STYLE = 'currentStyle',
	  RUNTIME_STYLE = 'runtimeStyle',
	  LEFT = 'left',
	  PX = 'px';

	function _getComputedStyleIE(elem, name) {
	  // currentStyle maybe null
	  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
	  var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];

	  // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
	  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
	  // 在 ie 下不对，需要直接用 offset 方式
	  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了

	  // From the awesome hack by Dean Edwards
	  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	  // If we're not dealing with a regular pixel number
	  // but a number that has a weird ending, we need to convert it to pixels
	  // exclude left right for relativity
	  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
	    // Remember the original values
	    var style = elem.style,
	      left = style[LEFT],
	      rsLeft = elem[RUNTIME_STYLE][LEFT];

	    // prevent flashing of content
	    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];

	    // Put in the new values to get a computed value out
	    style[LEFT] = name === 'fontSize' ? '1em' : (ret || 0);
	    ret = style.pixelLeft + PX;

	    // Revert the changed values
	    style[LEFT] = left;

	    elem[RUNTIME_STYLE][LEFT] = rsLeft;
	  }
	  return ret === '' ? 'auto' : ret;
	}

	var getComputedStyleX;
	if (typeof window !== 'undefined') {
	  getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
	}

	// 设置 elem 相对 elem.ownerDocument 的坐标
	function setOffset(elem, offset) {
	  // set position first, in-case top/left are set even on static elem
	  if (css(elem, 'position') === 'static') {
	    elem.style.position = 'relative';
	  }

	  var old = getOffset(elem),
	    ret = {},
	    current, key;

	  for (key in offset) {
	    current = parseFloat(css(elem, key)) || 0;
	    ret[key] = current + offset[key] - old[key];
	  }
	  css(elem, ret);
	}

	function each(arr, fn) {
	  for (var i = 0; i < arr.length; i++) {
	    fn(arr[i]);
	  }
	}

	function isBorderBoxFn(elem) {
	  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
	}

	var BOX_MODELS = ['margin', 'border', 'padding'],
	  CONTENT_INDEX = -1,
	  PADDING_INDEX = 2,
	  BORDER_INDEX = 1,
	  MARGIN_INDEX = 0;

	function swap(elem, options, callback) {
	  var old = {},
	    style = elem.style,
	    name;

	  // Remember the old values, and insert the new ones
	  for (name in options) {
	    old[name] = style[name];
	    style[name] = options[name];
	  }

	  callback.call(elem);

	  // Revert the old values
	  for (name in options) {
	    style[name] = old[name];
	  }
	}

	function getPBMWidth(elem, props, which) {
	  var value = 0, prop, j, i;
	  for (j = 0; j < props.length; j++) {
	    prop = props[j];
	    if (prop) {
	      for (i = 0; i < which.length; i++) {
	        var cssProp;
	        if (prop === 'border') {
	          cssProp = prop + which[i] + 'Width';
	        } else {
	          cssProp = prop + which[i];
	        }
	        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
	      }
	    }
	  }
	  return value;
	}

	/**
	 * A crude way of determining if an object is a window
	 * @member util
	 */
	function isWindow(obj) {
	  // must use == for ie8
	  /*jshint eqeqeq:false*/
	  return obj != null && obj == obj.window;
	}

	var domUtils = {};

	each(['Width', 'Height'], function (name) {
	  domUtils['doc' + name] = function (refWin) {
	    var d = refWin.document;
	    return Math.max(
	      //firefox chrome documentElement.scrollHeight< body.scrollHeight
	      //ie standard mode : documentElement.scrollHeight> body.scrollHeight
	      d.documentElement['scroll' + name],
	      //quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
	      d.body['scroll' + name],
	      domUtils['viewport' + name](d));
	  };

	  domUtils['viewport' + name] = function (win) {
	    // pc browser includes scrollbar in window.innerWidth
	    var prop = 'client' + name,
	      doc = win.document,
	      body = doc.body,
	      documentElement = doc.documentElement,
	      documentElementProp = documentElement[prop];
	    // 标准模式取 documentElement
	    // backcompat 取 body
	    return doc.compatMode === 'CSS1Compat' && documentElementProp ||
	      body && body[prop] || documentElementProp;
	  };
	});

	/*
	 得到元素的大小信息
	 @param elem
	 @param name
	 @param {String} [extra]  'padding' : (css width) + padding
	 'border' : (css width) + padding + border
	 'margin' : (css width) + padding + border + margin
	 */
	function getWH(elem, name, extra) {
	  if (isWindow(elem)) {
	    return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
	  } else if (elem.nodeType === 9) {
	    return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
	  }
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'],
	    borderBoxValue = name === 'width' ? elem.offsetWidth : elem.offsetHeight;
	  var computedStyle = getComputedStyleX(elem);
	  var isBorderBox = isBorderBoxFn(elem, computedStyle);
	  var cssBoxValue = 0;
	  if (borderBoxValue == null || borderBoxValue <= 0) {
	    borderBoxValue = undefined;
	    // Fall back to computed then un computed css if necessary
	    cssBoxValue = getComputedStyleX(elem, name);
	    if (cssBoxValue == null || (Number(cssBoxValue)) < 0) {
	      cssBoxValue = elem.style[name] || 0;
	    }
	    // Normalize '', auto, and prepare for extra
	    cssBoxValue = parseFloat(cssBoxValue) || 0;
	  }
	  if (extra === undefined) {
	    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
	  }
	  var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
	  var val = borderBoxValue || cssBoxValue;
	  if (extra === CONTENT_INDEX) {
	    if (borderBoxValueOrIsBorderBox) {
	      return val - getPBMWidth(elem, ['border', 'padding'],
	          which, computedStyle);
	    } else {
	      return cssBoxValue;
	    }
	  } else if (borderBoxValueOrIsBorderBox) {
	    return val + (extra === BORDER_INDEX ? 0 :
	        (extra === PADDING_INDEX ?
	          -getPBMWidth(elem, ['border'], which, computedStyle) :
	          getPBMWidth(elem, ['margin'], which, computedStyle)));
	  } else {
	    return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra),
	        which, computedStyle);
	  }
	}

	var cssShow = {position: 'absolute', visibility: 'hidden', display: 'block'};

	// fix #119 : https://github.com/kissyteam/kissy/issues/119
	function getWHIgnoreDisplay(elem) {
	  var val, args = arguments;
	  // in case elem is window
	  // elem.offsetWidth === undefined
	  if (elem.offsetWidth !== 0) {
	    val = getWH.apply(undefined, args);
	  } else {
	    swap(elem, cssShow, function () {
	      val = getWH.apply(undefined, args);
	    });
	  }
	  return val;
	}

	each(['width', 'height'], function (name) {
	  var first = name.charAt(0).toUpperCase() + name.slice(1);
	  domUtils['outer' + first] = function (el, includeMargin) {
	    return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
	  };
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

	  domUtils[name] = function (elem, val) {
	    if (val !== undefined) {
	      if (elem) {
	        var computedStyle = getComputedStyleX(elem);
	        var isBorderBox = isBorderBoxFn(elem);
	        if (isBorderBox) {
	          val += getPBMWidth(elem, ['padding', 'border'], which, computedStyle);
	        }
	        return css(elem, name, val);
	      }
	      return;
	    }
	    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
	  };
	});

	function css(el, name, value) {
	  if (typeof name === 'object') {
	    for (var i in name) {
	      css(el, i, name[i]);
	    }
	    return;
	  }
	  if (typeof value !== 'undefined') {
	    if (typeof value === 'number') {
	      value = value + 'px';
	    }
	    el.style[name] = value;
	  } else {
	    return getComputedStyleX(el, name);
	  }
	}

	function mix(to, from) {
	  for (var i in from) {
	    to[i] = from[i];
	  }
	  return to;
	}

	var utils = module.exports = {
	  getWindow: function (node) {
	    var doc = node.ownerDocument || node;
	    return doc.defaultView || doc.parentWindow;
	  },
	  offset: function (el, value) {
	    if (typeof value !== 'undefined') {
	      setOffset(el, value);
	    } else {
	      return getOffset(el);
	    }
	  },
	  isWindow: isWindow,
	  each: each,
	  css: css,
	  clone: function (obj) {
	    var ret = {};
	    for (var i in obj) {
	      ret[i] = obj[i];
	    }
	    var overflow = obj.overflow;
	    if (overflow) {
	      for (i in obj) {
	        ret.overflow[i] = obj.overflow[i];
	      }
	    }
	    return ret;
	  },
	  mix: mix,
	  scrollLeft: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollLeft(w);
	      } else {
	        window.scrollTo(v, getScrollTop(w));
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollLeft;
	      } else {
	        w.scrollLeft = v;
	      }
	    }
	  },
	  scrollTop: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollTop(w);
	      } else {
	        window.scrollTo(getScrollLeft(w), v);
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollTop;
	      } else {
	        w.scrollTop = v;
	      }
	    }
	  },
	  merge: function () {
	    var ret = {};
	    for (var i = 0; i < arguments.length; i++) {
	      utils.mix(ret, arguments[i]);
	    }
	    return ret;
	  },
	  viewportWidth: 0,
	  viewportHeight: 0
	};

	mix(utils, domUtils);


/***/ }
/******/ ]);