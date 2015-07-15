'use strict';


import React from 'react';
import {joinClasses, classSet, KeyCode} from 'rc-util';
import anim from 'css-animation';
import OptGroup from './OptGroup';
import domAlign from 'dom-align';
import SelectDropdown from './Dropdown';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, normValue
  } from './util';

function noop() {
}

function filterFn(input, child) {
  return getPropValue(child, this.props.optionFilterProp).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

export default
class Select extends React.Component {
  constructor(props) {
    super(...arguments);
    var value = [];
    if ('value' in props) {
      value = normValue(props.value);
    } else if ('defaultValue' in props) {
      value = normValue(props.defaultValue);
    }
    this.state = {
      value: value,
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
      'handleMenuDeselect'].forEach((m)=> {
        this[m] = this[m].bind(this);
      });
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    this.saveDropdownRef = saveRef.bind(this, 'dropdownInstance');
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: normValue(nextProps.value)
      });
    }
  }

  fireChange(value) {
    this.props.onChange(isMultipleOrTags(this.props) ? value : value[0]);
    this.setState({
      value: value
    });
  }

  getLabelByValue(children, value) {
    if (value === undefined) {
      return null;
    }
    var label = null;
    React.Children.forEach(children, (c) => {
      if (c.type === OptGroup) {
        var maybe = this.getLabelByValue(c.props.children, value);
        if (maybe != null) {
          label = maybe;
        }
      } else if (getValuePropValue(c) === value) {
        label = getPropValue(c, this.props.optionLabelProp);
      }
    });
    return label;
  }

  setOpenState(open) {
    var refs = this.refs;
    this.setState({
      open: open
    }, ()=> {
      if (open || isMultipleOrTagsOrCombobox(this.props)) {
        if (this.getInputDOMNode()) {
          this.getInputDOMNode().focus();
        }
      } else if (refs.selection) {
        React.findDOMNode(refs.selection).focus();
      }
    });
  }

  handleInputChange(e) {
    var val = e.target.value;
    var props = this.props;
    this.setState({
      inputValue: val,
      open: true
    });
    if (isCombobox(props)) {
      props.onChange(val);
    }
    props.onSearch(val);
  }

  handleClick() {
    if (!this.props.disabled) {
      if (this.state.open) {
        this.setOpenState(false);
      } else {
        this.openIfHasChildren();
      }
    }
  }

  openIfHasChildren() {
    var props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  }

  // combobox ignore
  handleKeyDown(e) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var keyCode = e.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.handleInputKeyDown(e);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.handleClick();
      e.preventDefault();
    }
  }

  handleInputKeyDown(e) {
    var props = this.props;
    var state = this.state;
    var keyCode = e.keyCode;
    if (isMultipleOrTags(props) && !e.target.value && keyCode === KeyCode.BACKSPACE) {
      var value = state.value.concat();
      if (value.length) {
        value.pop();
        this.fireChange(value);
      }
      return;
    }

    if (keyCode === KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    if (state.open) {
      var menu = this.dropdownInstance && this.dropdownInstance.refs.menu;
      if (menu && menu.handleKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  handleMenuSelect(key, item) {
    var value = this.state.value;
    var props = this.props;
    var selectedValue = getValuePropValue(item);
    if (value.indexOf(selectedValue) !== -1) {
      return;
    }
    if (isMultipleOrTags(props)) {
      value = value.concat([selectedValue]);
    } else {
      if (value[0] === selectedValue) {
        this.setOpenState(false);
        return;
      }
      value = [selectedValue];
    }
    props.onSelect(selectedValue, item);
    this.fireChange(value);
    this.setState({
      inputValue: ''
    });
    this.setOpenState(false);
    if (isCombobox(props)) {
      this.setState({
        inputValue: getPropValue(item, props.optionLabelProp)
      });
    }
  }

  handleMenuDeselect(key, item, e) {
    if (e.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setState({
      inputValue: ''
    });
    this.setOpenState(false);
  }

  handleBlur() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
    this._blurTimer = setTimeout(() => {
      this.setState({
        open: false
      });
    }, 100);
  }

  handleFocus() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
      this._blurTimer = null;
    }
  }

  removeSelected(selectedValue) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var value = this.state.value.filter((v)=> {
      return v !== selectedValue;
    });
    var canMultiple = isMultipleOrTags(props);
    if (canMultiple) {
      props.onDeselect(selectedValue);
    }
    this.fireChange(value);
  }

  handleClearSelection(e) {
    var props = this.props;
    var state = this.state;
    if (props.disabled) {
      return;
    }
    e.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setState({
        inputValue: ''
      });
    }
    this.setOpenState(false);
  }

  renderTopControlNode() {
    var value = this.state.value;
    var props = this.props;
    var prefixCls = props.prefixCls;
    var allowClear = props.allowClear;
    var children = props.children;
    var clear = <span className={prefixCls + '-selection__clear'}
      onClick={this.handleClearSelection}>×</span>;
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      return (<span className={prefixCls + '-selection__rendered'}>
        <span>{this.getLabelByValue(children, value[0]) || props.placeholder}</span>
          {allowClear ? clear : null}
      </span>);
    } else {
      var selectedValueNodes;
      if (isMultipleOrTags(props)) {
        selectedValueNodes = value.map((v) => {
          var content = this.getLabelByValue(children, v) || v;
          var title = content;
          var maxTagTextLength = props.maxTagTextLength;
          if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
            content = content.slice(0, maxTagTextLength) + '...';
          }
          return (
            <li className={prefixCls + '-selection__choice'}
              key={v}
              title={title}>
              <span className={prefixCls + '-selection__choice__content'}>{content}</span>
              <span className={prefixCls + '-selection__choice__remove'}
                onClick={this.removeSelected.bind(this, v)}/>
            </li>
          );
        });
      }
      return (
        <ul className={prefixCls + '-selection__rendered'}>
          {selectedValueNodes}
          {allowClear && !isMultipleOrTags(props) ? clear : null}
          <li className={joinClasses(prefixCls + '-search', prefixCls + '-search--inline')}>
          {this.getInputElement()}
          </li>
        </ul>
      );
    }
  }

  getDropdownDOMNode() {
    return React.findDOMNode(this.dropdownInstance);
  }

  getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  }

  renderDropdown(prevState) {
    var state = this.state;
    var props = this.props;
    var dropdownDOMNode;
    if (state.open && props.renderDropdownToBody) {
      React.render(this.getDropdownElement(), this.getDropdownContainer());
    }
    if (this.dropdownContainer) {
      this.dropdownContainer.className = `${this.props.prefixCls}-dropdown-container${state.open ? '-open' : ''}`;
    }
    if (props.dropdownMatchSelectWidth && state.open) {
      dropdownDOMNode = this.getDropdownDOMNode();
      if (dropdownDOMNode) {
        dropdownDOMNode.style.width = React.findDOMNode(this).offsetWidth + 'px';
      }
    }
    if (!prevState.open && state.open) {
      dropdownDOMNode = this.getDropdownDOMNode();
      if (dropdownDOMNode) {
        domAlign(dropdownDOMNode, React.findDOMNode(this), {
          points: ['tl', 'bl'],
          offset: [0, 4]
        });
      }
    }
  }

  getInputElement() {
    var props = this.props;
    return <input ref={this.saveInputRef}
      onChange={this.handleInputChange}
      onKeyDown={this.handleInputKeyDown}
      value={this.state.inputValue}
      disabled={props.disabled}
      placeholder={props.searchPlaceholder}
      className={props.prefixCls + '-search__field'}
      role="textbox" />;
  }

  getDropdownElement() {
    var state = this.state;
    var props = this.props;
    if (state.open) {
      this.cachedDropDown = <SelectDropdown
        key="dropdown"
        onDropdownFocus={this.handleFocus}
        onDropdownBlur={this.handleBlur}
        filterOption={props.filterOption}
        optionFilterProp={props.optionFilterProp}
        optionLabelProp={props.optionLabelProp}
        inputValue={state.inputValue}
        inputElement={this.getInputElement()}
        ref={this.saveDropdownRef}
        tags={props.tags}
        notFoundContent={props.notFoundContent}
        onMenuDeselect={this.handleMenuDeselect}
        onMenuSelect={this.handleMenuSelect}
        value={state.value}
        isMultipleOrTags={isMultipleOrTags(props)}
        prefixCls={props.prefixCls}
        isMultipleOrTagsOrCombobox={isMultipleOrTagsOrCombobox(props)}
        showSearch={props.showSearch}
        dropdownStyle={props.dropdownStyle}>
      {props.children}
      </SelectDropdown>;
    }
    return this.cachedDropDown;
  }

  animateDropdown(prevProps, prevState) {
    var props = this.props;
    var state = this.state;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-dropdown-${props.animation}`;
    }
    var domNode = this.getDropdownDOMNode();
    if (transitionName && domNode) {
      if (state.open && !prevState.open) {
        anim(domNode, `${transitionName}-enter`);
      } else if (!state.open && prevState.open) {
        anim(domNode, `${transitionName}-leave`);
      }
    }
  }

  getInputDOMNode() {
    return React.findDOMNode(this.inputInstance);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    prevState = prevState || {};
    this.renderDropdown(prevState);
    this.animateDropdown(prevProps, prevState);
    if (isMultipleOrTags(this.props)) {
      var inputNode = this.getInputDOMNode();
      if (inputNode.value) {
        inputNode.style.width = inputNode.scrollWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  }

  componentWillUnmount() {
    if (this.dropdownContainer) {
      React.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
    this.dropdownInstance = null;
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
      this._blurTimer = null;
    }
  }

  render() {
    var props = this.props;
    var multiple = isMultipleOrTags(props);
    var state = this.state;
    var prefixCls = props.prefixCls;
    var ctrlNode = this.renderTopControlNode();
    var extraSelectionProps = {};
    if (!isCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.handleKeyDown,
        tabIndex: 0
      };
    }
    var rootCls = {
      [prefixCls]: true,
      [prefixCls + '-open']: this.state.open,
      [prefixCls + '-combobox']: isCombobox(props),
      [prefixCls + '-disabled']: props.disabled
    };
    return (
      <span
        style={props.style}
        className={joinClasses(props.className, classSet(rootCls))}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}>
        <span ref="selection"
          key="selection"
          className={joinClasses(prefixCls + '-selection',
            `${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`)}
          role="combobox"
          aria-autocomplete="list"
          onClick={this.handleClick}
          aria-haspopup="true"
          aria-expanded={state.open}
      {...extraSelectionProps}
        >
        {ctrlNode}
        {multiple || !props.showArrow ? null :
          <span key="arrow" className={prefixCls + '-arrow'} tabIndex="-1" style={{outline: 'none'}}>
            <b></b>
          </span>}
        </span>
      {props.renderDropdownToBody ? null : this.getDropdownElement()}
      </span>
    );
  }
}

Select.propTypes = {
  multiple: React.PropTypes.bool,
  filterOption: React.PropTypes.any,
  showSearch: React.PropTypes.bool,
  showArrow: React.PropTypes.bool,
  renderDropdownToBody: React.PropTypes.bool,
  tags: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  optionLabelProp: React.PropTypes.string,
  optionFilterProp: React.PropTypes.string,
  animation: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  searchPlaceholder: React.PropTypes.string,
  placeholder: React.PropTypes.any,
  onDeselect: React.PropTypes.func,
  dropdownStyle: React.PropTypes.object,
  maxTagTextLength: React.PropTypes.number
};

Select.defaultProps = {
  prefixCls: 'rc-select',
  filterOption: filterFn,
  showSearch: true,
  allowClear: false,
  placeholder: '',
  searchPlaceholder: '',
  onChange: noop,
  onSelect: noop,
  onSearch: noop,
  onDeselect: noop,
  showArrow: true,
  dropdownMatchSelectWidth: true,
  dropdownStyle: {},
  renderDropdownToBody: false,
  optionFilterProp: 'value',
  optionLabelProp: 'value',
  notFoundContent: 'Not Found'
};
