import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { KeyCode } from 'rc-util';
import classnames from 'classnames';
import OptGroup from './OptGroup';
import Animate from 'rc-animate';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray, findIndexInValueByKey,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent,
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
    onSelect: PropTypes.func,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
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
      searchPlaceholder: '',
      defaultValue: [],
      onChange: noop,
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
    const state = this.state;
    const props = this.props;
    if (state.open && isMultipleOrTags(props)) {
      const inputNode = this.getInputDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = `${inputNode.scrollWidth}px`;
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount() {
    this.clearDelayTimer();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange(event) {
    const val = event.target.value;
    const { props } = this;
    this.setState({
      inputValue: val,
      open: true,
    });
    if (isCombobox(props)) {
      this.fireChange([{
        key: val,
      }]);
    }
    props.onSearch(val);
  },

  onDropdownVisibleChange(open) {
    // selection inside combobox cause click
    if (!open && document.activeElement === this.getInputDOMNode()) {
      return;
    }
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

  onInputBlur() {
    if (isMultipleOrTagsOrCombobox(this.props)) {
      return;
    }
    this.clearDelayTimer();
    this.delayTimer = setTimeout(() => {
      this.setOpenState(false);
    }, 150);
  },

  onInputFocus() {
    this.clearDelayTimer();
  },

  onInputKeyDown(event) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const state = this.state;
    const keyCode = event.keyCode;
    if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
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
    this.setState({
      inputValue: '',
    });
    if (isCombobox(props)) {
      this.setState({
        inputValue: getPropValue(item, props.optionLabelProp),
      });
    }
  },

  onMenuDeselect({ item, domEvent }) {
    if (domEvent.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setState({
      inputValue: '',
    });
  },

  onPlaceholderClick() {
    this.getInputDOMNode().focus();
  },

  onClearSelection(event) {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setOpenState(false);
      this.setState({
        inputValue: '',
      });
    }
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

  getSearchPlaceholderElement(hidden) {
    const props = this.props;
    let placeholder;
    if (isMultipleOrTagsOrCombobox(props)) {
      placeholder = props.placeholder || props.searchPlaceholder;
    } else {
      placeholder = props.searchPlaceholder;
    }
    if (placeholder) {
      return (<span
        onMouseDown={preventDefaultEvent}
        style={{
          display: hidden ? 'none' : 'block',
          ...UNSELECTABLE_STYLE,
        }}
        {...UNSELECTABLE_ATTRIBUTE}
        onClick={this.onPlaceholderClick}
        className={`${props.prefixCls}-search__field__placeholder`}
      >
        {placeholder}
      </span>);
    }
    return null;
  },

  getInputElement() {
    const props = this.props;
    return (<span className={`${props.prefixCls}-search__field__wrap`}>
      <input
        ref={this.saveInputRef}
        onBlur={this.onInputBlur}
        onFocus={this.onInputFocus}
        onChange={this.onInputChange}
        onKeyDown={this.onInputKeyDown}
        value={this.state.inputValue}
        disabled={props.disabled}
        className={`${props.prefixCls}-search__field`}
        role="textbox"
      />
      {isMultipleOrTags(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)}
    </span>);
  },

  getInputDOMNode() {
    return this.inputInstance;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },

  getPopupMenuComponent() {
    return this.refs.trigger.getInnerMenu();
  },

  setOpenState(open, needFocus) {
    this.clearDelayTimer();
    const { props, refs } = this;
    // can not optimize, if children is empty
    // if (this.state.open === open) {
    //   return;
    // }
    this.setState({
      open,
    }, () => {
      if (needFocus || open) {
        if (open || isMultipleOrTagsOrCombobox(props)) {
          const input = this.getInputDOMNode();
          if (input && document.activeElement !== input) {
            input.focus();
          }
        } else if (refs.selection) {
          refs.selection.focus();
        }
      }
    });
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

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
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
    const { value } = this.state;
    const props = this.props;
    const { choiceTransitionName, prefixCls, maxTagTextLength } = props;
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      let innerNode = (<span
        key="placeholder"
        className={`${prefixCls}-selection__placeholder`}
      >
        {props.placeholder}
      </span>);
      if (value.length) {
        innerNode = <span key="value">{value[0].label}</span>;
      }
      return (<span className={`${prefixCls}-selection__rendered`}>
        {innerNode}
      </span>);
    }

    let selectedValueNodes = [];
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((singleValue) => {
        let content = singleValue.label;
        const title = content;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = `${content.slice(0, maxTagTextLength)}...`;
        }
        return (
          <li
            style={UNSELECTABLE_STYLE}
            {...UNSELECTABLE_ATTRIBUTE}
            onMouseDown={preventDefaultEvent}
            className={`${prefixCls}-selection__choice`}
            key={singleValue.key}
            title={title}
          >
            <span className={`${prefixCls}-selection__choice__content`}>{content}</span>
            <span
              className={`${prefixCls}-selection__choice__remove`}
              onClick={this.removeSelected.bind(this, singleValue.key)}
            />
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
    const className = `${prefixCls}-selection__rendered`;
    if (isMultipleOrTags(props) && choiceTransitionName) {
      return (<Animate
        className={className}
        component="ul"
        transitionName={choiceTransitionName}
      >
        {selectedValueNodes}
      </Animate>);
    }
    return (<ul className={className}>{selectedValueNodes}</ul>);
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
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
    };

    const clear = (<span
      key="clear"
      className={`${prefixCls}-selection__clear`}
      onClick={this.onClearSelection}
    />);
    return (
      <SelectTrigger
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
        inputElement={this.getInputElement()}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        ref="trigger"
      >
        <span
          style={props.style}
          className={classnames(rootCls)}
        >
          <span
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
                style={{ outline: 'none' }}
              >
              <b/>
            </span>)}
            {multiple ?
              this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) :
              null}
          </span>
        </span>
      </SelectTrigger>
    );
  },
});

export default Select;
