import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import KeyCode from 'rc-util/lib/KeyCode';
import classnames from 'classnames';
import Animate from 'rc-animate';
import classes from 'component-classes';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray, findIndexInValueByKey,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent, findFirstMenuItem,
  includesSeparators, splitBySeparators,
  findIndexInValueByLabel,
} from './util';
import SelectTrigger from './SelectTrigger';
import FilterMixin from './FilterMixin';

function noop() {
}

function filterFn(input, child) {
  return String(getPropValue(child, this.props.optionFilterProp)).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

let valueObjectShape;

if (PropTypes) {
  valueObjectShape = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.node,
    }),
  ]);
}

const Select = React.createClass({
  propTypes: {
    defaultActiveFirstOption: PropTypes.bool,
    multiple: PropTypes.bool,
    filterOption: PropTypes.any,
    children: PropTypes.any,
    showSearch: PropTypes.bool,
    disabled: PropTypes.bool,
    allowClear: PropTypes.bool,
    showArrow: PropTypes.bool,
    tags: PropTypes.bool,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    transitionName: PropTypes.string,
    optionLabelProp: PropTypes.string,
    optionFilterProp: PropTypes.string,
    animation: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.any,
    onDeselect: PropTypes.func,
    labelInValue: PropTypes.bool,
    value: PropTypes.oneOfType([
      valueObjectShape,
      PropTypes.arrayOf(valueObjectShape),
    ]),
    defaultValue: PropTypes.oneOfType([
      valueObjectShape,
      PropTypes.arrayOf(valueObjectShape),
    ]),
    dropdownStyle: PropTypes.object,
    maxTagTextLength: PropTypes.number,
    tokenSeparators: PropTypes.arrayOf(PropTypes.string),
    getInputElement: PropTypes.func,
    creatable: PropTypes.bool,
  },

  mixins: [FilterMixin],

  getDefaultProps() {
    return {
      prefixCls: 'rc-select',
      filterOption: filterFn,
      defaultOpen: false,
      labelInValue: false,
      defaultActiveFirstOption: true,
      showSearch: true,
      allowClear: false,
      placeholder: '',
      defaultValue: [],
      onChange: noop,
      onFocus: noop,
      onBlur: noop,
      onSelect: noop,
      onSearch: noop,
      onDeselect: noop,
      showArrow: true,
      dropdownMatchSelectWidth: true,
      dropdownStyle: {},
      dropdownMenuStyle: {},
      optionFilterProp: 'value',
      optionLabelProp: 'value',
      notFoundContent: 'Not Found',
      creatable: false,
    };
  },

  getInitialState() {
    const props = this.props;
    let value = [];
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    value = this.addLabelToValue(props, value);
    value = this.addTitleToValue(props, value);
    let inputValue = '';
    if (props.combobox) {
      inputValue = value.length ? this.getLabelFromProps(props, value[0].key) : '';
    }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    this.saveInputMirrorRef = saveRef.bind(this, 'inputMirrorInstance');
    let open = props.open;
    if (open === undefined) {
      open = props.defaultOpen;
    }
    return {
      value,
      inputValue,
      open,
    };
  },

  componentWillMount() {
    this.adjustOpenState();
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      let value = toArray(nextProps.value);
      value = this.addLabelToValue(nextProps, value);
      value = this.addTitleToValue(nextProps, value);
      this.setState({
        value,
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value.length ? this.getLabelFromProps(nextProps, value[0].key) : '',
        });
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps;
    this.state = nextState;
    this.adjustOpenState();
  },

  componentDidUpdate() {
    if (isMultipleOrTags(this.props)) {
      const inputNode = this.getInputDOMNode();
      const mirrorNode = this.getInputMirrorDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = `${mirrorNode.clientWidth}px`;
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount() {
    this.clearBlurTime();
    this.clearAdjustTimer();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange(event) {
    const { tokenSeparators } = this.props;
    const val = event.target.value;
    if (isMultipleOrTags(this.props) &&
      tokenSeparators &&
      includesSeparators(val, tokenSeparators)) {
      const nextValue = this.tokenize(val);
      this.fireChange(nextValue);
      this.setOpenState(false, true);
      this.setInputValue('', false);
      return;
    }
    this.setInputValue(val);
    this.setState({
      open: true,
    });
    if (isCombobox(this.props)) {
      this.fireChange([{
        key: val,
      }]);
    }
  },

  onDropdownVisibleChange(open) {
    this.setOpenState(open);
  },

  // combobox ignore
  onKeyDown(event) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const keyCode = event.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  },

  onInputKeyDown(event) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const state = this.state;
    const keyCode = event.keyCode;
    if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
      event.preventDefault();
      const { value } = state;
      if (value.length) {
        this.removeSelected(value[value.length - 1].key);
      }
      return;
    }
    if (keyCode === KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (state.open) {
      const menu = this.refs.trigger.getInnerMenu();
      if (menu && menu.onKeyDown(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },

  onMenuSelect({ item }) {
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const selectedLabel = this.getLabelFromOption(item);
    let event = selectedValue;
    if (props.labelInValue) {
      event = {
        key: event,
        label: selectedLabel,
      };
    }
    props.onSelect(event, item);
    const selectedTitle = item.props.title;
    if (isMultipleOrTags(props)) {
      if (findIndexInValueByKey(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([{
        key: selectedValue,
        label: selectedLabel,
        title: selectedTitle,
      }]);
    } else {
      if (isCombobox(props)) {
        this.skipAdjustOpen = true;
        this.clearAdjustTimer();
        this.skipAdjustOpenTimer = setTimeout(() => {
          this.skipAdjustOpen = false;
        }, 0);
      }
      if (value.length && value[0].key === selectedValue) {
        this.setOpenState(false, true);
        return;
      }
      value = [{
        key: selectedValue,
        label: selectedLabel,
        title: selectedTitle,
      }];
      this.setOpenState(false, true);
    }
    this.fireChange(value);
    let inputValue;
    if (isCombobox(props)) {
      inputValue = getPropValue(item, props.optionLabelProp);
    } else {
      inputValue = '';
    }
    this.setInputValue(inputValue, false);
  },

  onMenuDeselect({ item, domEvent }) {
    if (domEvent.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setInputValue('', false);
  },

  onArrowClick(e) {
    e.stopPropagation();
    if (!this.props.disabled) {
      this.setOpenState(!this.state.open, !this.state.open);
    }
  },

  onPlaceholderClick() {
    if (this.getInputDOMNode()) {
      this.getInputDOMNode().focus();
    }
  },

  onOuterFocus(e) {
    if (e.target === this.getInputDOMNode()) {
      return;
    }
    this.clearBlurTime();
    this._focused = true;
    this.updateFocusClassName();
    this.props.onFocus();
  },

  onPopupFocus() {
    // fix ie scrollbar, focus element again
    this.maybeFocus(true, true);
  },

  onOuterBlur() {
    this.blurTimer = setTimeout(() => {
      this._focused = false;
      this.updateFocusClassName();
      const props = this.props;
      let { value } = this.state;
      const { inputValue } = this.state;
      if (isSingleMode(props) && props.showSearch &&
        inputValue && props.defaultActiveFirstOption) {
        const options = this._options || [];
        if (options.length) {
          const firstOption = findFirstMenuItem(options);
          if (firstOption) {
            value = [{
              key: firstOption.key,
              label: this.getLabelFromOption(firstOption),
            }];
            this.fireChange(value);
          }
        }
      } else if (isMultipleOrTags(props) && inputValue) {
        // why not use setState?
        this.state.inputValue = this.getInputDOMNode().value = '';
      }
      props.onBlur(this.getVLForOnChange(value));
    }, 10);
  },

  onClearSelection(event) {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    const { inputValue, value } = state;
    event.stopPropagation();
    if (inputValue || value.length) {
      if (value.length) {
        this.fireChange([]);
      }
      this.setOpenState(false, true);
      if (inputValue) {
        this.setInputValue('');
      }
    }
  },

  onChoiceAnimationLeave() {
    this.refs.trigger.refs.trigger.forcePopupAlign();
  },

  getLabelBySingleValue(children, value) {
    if (value === undefined) {
      return null;
    }
    let label = null;
    React.Children.forEach(children, (child) => {
      if (child.type.isSelectOptGroup) {
        const maybe = this.getLabelBySingleValue(child.props.children, value);
        if (maybe !== null) {
          label = maybe;
        }
      } else if (getValuePropValue(child) === value) {
        label = this.getLabelFromOption(child);
      }
    });
    return label;
  },

  getValueByLabel(children, label) {
    if (label === undefined) {
      return null;
    }
    let value = null;
    React.Children.forEach(children, (child) => {
      if (child.type.isSelectOptGroup) {
        const maybe = this.getValueByLabel(child.props.children, label);
        if (maybe !== null) {
          value = maybe;
        }
      } else if (toArray(this.getLabelFromOption(child)).join('') === label) {
        value = getValuePropValue(child);
      }
    });
    return value;
  },

  getLabelFromOption(child) {
    return getPropValue(child, this.props.optionLabelProp);
  },

  getLabelFromProps(props, value) {
    return this.getLabelByValue(props.children, value);
  },

  getVLForOnChange(vls_) {
    let vls = vls_;
    if (vls !== undefined) {
      if (!this.props.labelInValue) {
        vls = vls.map(v => v.key);
      } else {
        vls = vls.map(vl => ({ key: vl.key, label: vl.label }));
      }
      return isMultipleOrTags(this.props) ? vls : vls[0];
    }
    return vls;
  },

  getLabelByValue(children, value) {
    const label = this.getLabelBySingleValue(children, value);
    if (label === null) {
      return value;
    }
    return label;
  },

  getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  },

  getPlaceholderElement() {
    const { props, state } = this;
    let hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    if (state.value.length) {
      hidden = true;
    }
    if (isCombobox(props) && state.value.length === 1 && !state.value[0].key) {
      hidden = false;
    }
    const placeholder = props.placeholder;
    if (placeholder) {
      return (<div
        onMouseDown={preventDefaultEvent}
        style={{
          display: hidden ? 'none' : 'block',
          ...UNSELECTABLE_STYLE,
        }}
        {...UNSELECTABLE_ATTRIBUTE}
        onClick={this.onPlaceholderClick}
        className={`${props.prefixCls}-selection__placeholder`}
      >
        {placeholder}
      </div>);
    }
    return null;
  },

  getInputElement() {
    const props = this.props;
    const inputElement = props.getInputElement ? props.getInputElement() : <input />;
    const inputCls = classnames(inputElement.props.className, {
      [`${props.prefixCls}-search__field`]: true,
    });
    return (<div className={`${props.prefixCls}-search__field__wrap`}>
      {React.cloneElement(inputElement, {
        ref: this.saveInputRef,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKeyDown,
        value: this.state.inputValue,
        disabled: props.disabled,
        className: inputCls,
      })}
      <span
        ref={this.saveInputMirrorRef}
        className={`${props.prefixCls}-search__field__mirror`}
      >
        {this.state.inputValue}
      </span>
    </div>);
  },

  getInputDOMNode() {
    return this.inputInstance;
  },

  getInputMirrorDOMNode() {
    return this.inputMirrorInstance;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },

  getPopupMenuComponent() {
    return this.refs.trigger.getInnerMenu();
  },

  setOpenState(open, needFocus) {
    const { props, state } = this;
    if (state.open === open) {
      this.maybeFocus(open, needFocus);
      return;
    }
    const nextState = {
      open,
    };
    // clear search input value when open is false in singleMode.
    if (!open && isSingleMode(props) && props.showSearch) {
      this.setInputValue('');
    }
    if (!open) {
      this.maybeFocus(open, needFocus);
    }
    this.setState(nextState, () => {
      if (open) {
        this.maybeFocus(open, needFocus);
      }
    });
  },
  setInputValue(inputValue, fireSearch = true) {
    this.setState({
      inputValue,
    });
    if (fireSearch) {
      this.props.onSearch(inputValue);
    }
  },
  clearBlurTime() {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  },
  clearAdjustTimer() {
    if (this.skipAdjustOpenTimer) {
      clearTimeout(this.skipAdjustOpenTimer);
      this.skipAdjustOpenTimer = null;
    }
  },
  updateFocusClassName() {
    const { refs, props } = this;
    // avoid setState and its side effect
    if (this._focused) {
      classes(refs.root).add(`${props.prefixCls}-focused`);
    } else {
      classes(refs.root).remove(`${props.prefixCls}-focused`);
    }
  },

  maybeFocus(open, needFocus) {
    if (needFocus || open) {
      const input = this.getInputDOMNode();
      const { activeElement } = document;
      if (input && (open || isMultipleOrTagsOrCombobox(this.props))) {
        if (activeElement !== input) {
          input.focus();
        }
      } else {
        const selection = this.refs.selection;
        if (activeElement !== selection) {
          selection.focus();
        }
      }
    }
  },

  addLabelToValue(props, value_) {
    let value = value_;
    if (props.labelInValue) {
      value.forEach(v => {
        v.label = v.label || this.getLabelFromProps(props, v.key);
      });
    } else {
      value = value.map(v => {
        return {
          key: v,
          label: this.getLabelFromProps(props, v),
        };
      });
    }
    return value;
  },

  addTitleToValue(props, values) {
    let nextValues = values;
    const keys = values.map(v => v.key);
    React.Children.forEach(props.children, (child) => {
      if (child.type.isSelectOptGroup) {
        nextValues = this.addTitleToValue(child.props, nextValues);
      } else {
        const value = getValuePropValue(child);
        const valueIndex = keys.indexOf(value);
        if (valueIndex > -1) {
          nextValues[valueIndex].title = child.props.title;
        }
      }
    });
    return nextValues;
  },

  removeSelected(selectedKey) {
    const props = this.props;
    if (props.disabled || this.isChildDisabled(selectedKey)) {
      return;
    }
    let label;
    const value = this.state.value.filter((singleValue) => {
      if (singleValue.key === selectedKey) {
        label = singleValue.label;
      }
      return (singleValue.key !== selectedKey);
    });
    const canMultiple = isMultipleOrTags(props);

    if (canMultiple) {
      let event = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey,
          label,
        };
      }
      props.onDeselect(event);
    }
    this.fireChange(value);
  },

  openIfHasChildren() {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  },
  fireChange(value) {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({
        value,
      });
    }
    props.onChange(this.getVLForOnChange(value));
  },

  isChildDisabled(key) {
    return toArray(this.props.children).some(child => {
      const childValue = getValuePropValue(child);
      return childValue === key && child.props && child.props.disabled;
    });
  },

  tokenize(string) {
    const { multiple, tokenSeparators, children } = this.props;
    let nextValue = this.state.value;
    splitBySeparators(string, tokenSeparators).forEach(label => {
      const selectedValue = { key: label, label };
      if (findIndexInValueByLabel(nextValue, label) === -1) {
        if (multiple) {
          const value = this.getValueByLabel(children, label);
          if (value) {
            selectedValue.key = value;
            nextValue = nextValue.concat(selectedValue);
          }
        } else {
          nextValue = nextValue.concat(selectedValue);
        }
      }
    });
    return nextValue;
  },

  adjustOpenState() {
    if (this.skipAdjustOpen) {
      return;
    }
    let { open } = this.state;
    if (typeof document !== 'undefined' &&
      this.getInputDOMNode() &&
      document.activeElement === this.getInputDOMNode()) {
      open = true;
    }
    let options = [];
    if (open) {
      options = this.renderFilterOptions();
    }
    this._options = options;
    if (open &&
      (isMultipleOrTagsOrCombobox(this.props) || !this.props.showSearch) && !options.length) {
      open = false;
    }
    this.state.open = open;
  },

  renderTopControlNode() {
    const { value, open, inputValue } = this.state;
    const props = this.props;
    const { choiceTransitionName, prefixCls, maxTagTextLength, showSearch } = props;
    const className = `${prefixCls}-selection__rendered`;
    // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
    let innerNode = null;
    if (isSingleMode(props)) {
      let selectedValue = null;
      if (value.length) {
        let showSelectedValue = false;
        let opacity = 1;
        if (!showSearch) {
          showSelectedValue = true;
        } else {
          if (open) {
            showSelectedValue = !inputValue;
            if (showSelectedValue) {
              opacity = 0.4;
            }
          } else {
            showSelectedValue = true;
          }
        }
        const singleValue = value[0];
        selectedValue = (
          <div
            key="value"
            className={`${prefixCls}-selection-selected-value`}
            title={singleValue.title || singleValue.label}
            style={{
              display: showSelectedValue ? 'block' : 'none',
              opacity,
            }}
          >
            {value[0].label}
          </div>);
      }
      if (!showSearch) {
        innerNode = [selectedValue];
      } else {
        innerNode = [selectedValue, <div
          className={`${prefixCls}-search ${prefixCls}-search--inline`}
          key="input"
          style={{
            display: open ? 'block' : 'none',
          }}
        >
          {this.getInputElement()}
        </div>];
      }
    } else {
      let selectedValueNodes = [];
      if (isMultipleOrTags(props)) {
        selectedValueNodes = value.map((singleValue) => {
          let content = singleValue.label;
          const title = singleValue.title || content;
          if (maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength) {
            content = `${content.slice(0, maxTagTextLength)}...`;
          }
          const disabled = this.isChildDisabled(singleValue.key);
          const choiceClassName = disabled
            ? `${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`
            : `${prefixCls}-selection__choice`;
          return (
            <li
              style={UNSELECTABLE_STYLE}
              {...UNSELECTABLE_ATTRIBUTE}
              onMouseDown={preventDefaultEvent}
              className={choiceClassName}
              key={singleValue.key}
              title={title}
            >
              <div className={`${prefixCls}-selection__choice__content`}>{content}</div>
              {
                disabled ? null : <span
                  className={`${prefixCls}-selection__choice__remove`}
                  onClick={this.removeSelected.bind(this, singleValue.key)}
                />
              }
            </li>
          );
        });
      }
      selectedValueNodes.push(<li
        className={`${prefixCls}-search ${prefixCls}-search--inline`}
        key="__input"
      >
        {this.getInputElement()}
      </li>);

      if (isMultipleOrTags(props) && choiceTransitionName) {
        innerNode = (<Animate
          onLeave={this.onChoiceAnimationLeave}
          component="ul"
          transitionName={choiceTransitionName}
        >
          {selectedValueNodes}
        </Animate>);
      } else {
        innerNode = <ul>{selectedValueNodes}</ul>;
      }
    }
    return (<div className={className}>{this.getPlaceholderElement()}{innerNode}</div>);
  },

  render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);
    const state = this.state;
    const { className, disabled, allowClear, prefixCls } = props;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    const { open } = this.state;
    const options = this._options;
    if (!isMultipleOrTagsOrCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0,
      };
    }
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-focused`]: open || !!this._focused,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
    };
    const clearStyle = {
      ...UNSELECTABLE_STYLE,
      display: 'none',
    };
    if (state.inputValue || state.value.length) {
      clearStyle.display = 'block';
    }
    const clear = (<span
      key="clear"
      onMouseDown={preventDefaultEvent}
      style={clearStyle}
      {...UNSELECTABLE_ATTRIBUTE}
      className={`${prefixCls}-selection__clear`}
      onClick={this.onClearSelection}
    />);
    return (
      <SelectTrigger
        onPopupFocus={this.onPopupFocus}
        dropdownAlign={props.dropdownAlign}
        dropdownClassName={props.dropdownClassName}
        dropdownMatchSelectWidth={props.dropdownMatchSelectWidth}
        defaultActiveFirstOption={props.defaultActiveFirstOption}
        dropdownMenuStyle={props.dropdownMenuStyle}
        transitionName={props.transitionName}
        animation={props.animation}
        prefixCls={props.prefixCls}
        dropdownStyle={props.dropdownStyle}
        combobox={props.combobox}
        showSearch={props.showSearch}
        options={options}
        multiple={multiple}
        disabled={disabled}
        visible={open}
        inputValue={state.inputValue}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={props.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        ref="trigger"
      >
        <div
          style={props.style}
          ref="root"
          onBlur={this.onOuterBlur}
          onFocus={this.onOuterFocus}
          className={classnames(rootCls)}
        >
          <div
            ref="selection"
            key="selection"
            className={`${prefixCls}-selection
            ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-expanded={open}
            {...extraSelectionProps}
          >
            {ctrlNode}
            {allowClear && !multiple ? clear : null}
            {multiple || !props.showArrow ? null :
              (<span
                key="arrow"
                className={`${prefixCls}-arrow`}
                style={UNSELECTABLE_STYLE}
                {...UNSELECTABLE_ATTRIBUTE}
                onClick={this.onArrowClick}
              >
              <b />
            </span>)}
          </div>
        </div>
      </SelectTrigger>
    );
  },
});

export default Select;
