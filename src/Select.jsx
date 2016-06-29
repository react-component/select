import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { KeyCode } from 'rc-util';
import classnames from 'classnames';
import OptGroup from './OptGroup';
import Animate from 'rc-animate';
import classes from 'component-classes';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray, findIndexInValueByKey,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent, findFirstMenuItem,
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

const Select = React.createClass({
  propTypes: {
    defaultActiveFirstOption: PropTypes.bool,
    multiple: PropTypes.bool,
    filterOption: PropTypes.any,
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
    onSelect: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.any,
    onDeselect: PropTypes.func,
    labelInValue: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    dropdownStyle: PropTypes.object,
    maxTagTextLength: PropTypes.number,
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
    let inputValue = '';
    if (props.combobox) {
      inputValue = value.length ? String(value[0].key) : '';
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

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      let value = toArray(nextProps.value);
      value = this.addLabelToValue(nextProps, value);
      this.setState({
        value,
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value.length ? String(value[0].key) : '',
        });
      }
    }
  },

  componentDidUpdate() {
    const { state, props } = this;
    if (state.open && isMultipleOrTags(props)) {
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
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange(event) {
    const val = event.target.value;
    const { props } = this;
    this.setInputValue(val);
    this.setState({
      open: true,
    });
    if (isCombobox(props)) {
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
      const value = state.value.concat();
      if (value.length) {
        const popValue = value.pop();
        props.onDeselect(props.labelInValue ? popValue : popValue.key);
        this.fireChange(value);
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
    if (isMultipleOrTags(props)) {
      if (findIndexInValueByKey(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([{
        key: selectedValue,
        label: selectedLabel,
      }]);
    } else {
      if (value.length && value[0].key === selectedValue) {
        this.setOpenState(false, true);
        return;
      }
      value = [{
        key: selectedValue,
        label: selectedLabel,
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
      this.setOpenState(!this.state.open, true);
    }
  },

  onPlaceholderClick() {
    if (this.getInputDOMNode()) {
      this.getInputDOMNode().focus();
    }
  },

  onOuterFocus() {
    this.clearBlurTime();
    this._focused = true;
    this.updateFocusClassName();
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
      if (isSingleMode(props) && props.showSearch &&
        this.state.inputValue && props.defaultActiveFirstOption) {
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
      if (child.type === OptGroup) {
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
    return (<div className={`${props.prefixCls}-search__field__wrap`}>
      <input
        ref={this.saveInputRef}
        onChange={this.onInputChange}
        onKeyDown={this.onInputKeyDown}
        value={this.state.inputValue}
        disabled={props.disabled}
        className={`${props.prefixCls}-search__field`}
      />
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

  removeSelected(selectedKey) {
    const props = this.props;
    if (props.disabled) {
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
        selectedValue = (
          <div
            key="value"
            className={`${prefixCls}-selection-selected-value`}
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
          const title = content;
          if (maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength) {
            content = `${content.slice(0, maxTagTextLength)}...`;
          }
          const disabled = toArray(props.children).some(child => {
            const childValue = getValuePropValue(child);
            return childValue === singleValue.key && child.props && child.props.disabled;
          });
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
    let { open } = this.state;
    let options = [];
    if (open) {
      options = this.renderFilterOptions();
    }
    this._options = options;
    if (open && (isMultipleOrTagsOrCombobox(props) || !props.showSearch) && !options.length) {
      open = false;
    }
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
                onMouseDown={preventDefaultEvent}
                onClick={this.onArrowClick}
              >
              <b/>
            </span>)}
          </div>
        </div>
      </SelectTrigger>
    );
  },
});

export default Select;
