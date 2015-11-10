import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {classSet, KeyCode} from 'rc-util';
import OptGroup from './OptGroup';
import {
  getPropValue, getValuePropValue, isCombobox,
  isMultipleOrTags, isMultipleOrTagsOrCombobox,
  isSingleMode, toArray,
} from './util';
import SelectTrigger from './SelectTrigger';

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
    multiple: PropTypes.bool,
    filterOption: PropTypes.any,
    showSearch: PropTypes.bool,
    disabled: PropTypes.bool,
    showArrow: PropTypes.bool,
    tags: PropTypes.bool,
    transitionName: PropTypes.string,
    optionLabelProp: PropTypes.string,
    optionFilterProp: PropTypes.string,
    animation: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.any,
    onDeselect: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    label: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
    defaultLabel: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
    dropdownStyle: PropTypes.object,
    maxTagTextLength: PropTypes.number,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-select',
      filterOption: filterFn,
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
    const label = this.getLabelFromProps(props, value, 1);
    let inputValue = '';
    if (props.combobox) {
      inputValue = value[0] || '';
    }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    return {value, inputValue, label};
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = toArray(nextProps.value);
      const label = this.getLabelFromProps(nextProps, value);
      this.setState({
        value,
        label,
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value[0] || '',
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
        inputNode.style.width = inputNode.scrollWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount() {
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange(event) {
    const val = event.target.value;
    const props = this.props;
    this.setState({
      inputValue: val,
      open: true,
    });
    if (isCombobox(props)) {
      this.fireChange([val], [val]);
    }
    props.onSearch(val);
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
    const state = this.state;
    const keyCode = event.keyCode;
    if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
      const value = state.value.concat();
      if (value.length) {
        const label = state.label.concat();
        const popValue = value.pop();
        label.pop();
        props.onDeselect(popValue);
        this.fireChange(value, label);
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

  onMenuSelect({item}) {
    let value = this.state.value;
    let label = this.state.label;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const selectedLabel = this.getLabelFromOption(item);
    props.onSelect(selectedValue, item);
    if (isMultipleOrTags(props)) {
      if (value.indexOf(selectedValue) !== -1) {
        return;
      }
      value = value.concat([selectedValue]);
      label = label.concat([selectedLabel]);
    } else {
      if (value[0] === selectedValue) {
        this.setOpenState(false);
        return;
      }
      value = [selectedValue];
      label = [selectedLabel];
    }
    this.fireChange(value, label);
    this.setOpenState(false);
    this.setState({
      inputValue: '',
    });
    if (isCombobox(props)) {
      this.setState({
        inputValue: getPropValue(item, props.optionLabelProp),
      });
    }
  },

  onMenuDeselect({item, domEvent}) {
    if (domEvent.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setOpenState(false);
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
      this.fireChange([], []);
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

  getLabelFromProps(props, value, init) {
    let label = [];
    if ('label' in props) {
      label = toArray(props.label);
    } else if (init && 'defaultLabel' in props) {
      label = toArray(props.defaultLabel);
    } else {
      label = this.getLabelByValue(props.children, value);
    }
    return label;
  },

  getVLForOnChange(vls) {
    if (vls !== undefined) {
      return isMultipleOrTags(this.props) ? vls : vls[0];
    }
    return vls;
  },

  getLabelByValue(children, values) {
    return values.map((value)=> {
      const label = this.getLabelBySingleValue(children, value);
      if (label === null) {
        return value;
      }
      return label;
    });
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
    if (props.searchPlaceholder) {
      return (<span
        style={{display: hidden ? 'none' : 'block'}}
        onClick={this.onPlaceholderClick}
        className={props.prefixCls + '-search__field__placeholder'}>{props.searchPlaceholder}</span>);
    }
    return null;
  },

  getInputElement() {
    const props = this.props;
    return (<span className={props.prefixCls + '-search__field__wrap'}>
    <input ref={this.saveInputRef}
           onChange={this.onInputChange}
           onKeyDown={this.onInputKeyDown}
           value={this.state.inputValue}
           disabled={props.disabled}
           className={props.prefixCls + '-search__field'}
           role="textbox"/>
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

  setOpenState(open) {
    const refs = this.refs;
    this.setState({
      open,
    }, ()=> {
      if (open || isMultipleOrTagsOrCombobox(this.props)) {
        if (this.getInputDOMNode()) {
          this.getInputDOMNode().focus();
        }
      } else if (refs.selection) {
        refs.selection.focus();
      }
    });
  },

  removeSelected(selectedValue) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const label = this.state.label.concat();
    const index = this.state.value.indexOf(selectedValue);
    const value = this.state.value.filter((singleValue) => {
      return (singleValue !== selectedValue);
    });
    if (index !== -1) {
      label.splice(index, 1);
    }
    const canMultiple = isMultipleOrTags(props);
    if (canMultiple) {
      props.onDeselect(selectedValue);
    }
    this.fireChange(value, label);
  },

  openIfHasChildren() {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  },

  fireChange(value, label) {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({
        value, label,
      });
    }
    props.onChange(this.getVLForOnChange(value), this.getVLForOnChange(label));
  },

  renderTopControlNode() {
    const value = this.state.value;
    const label = this.state.label;
    const props = this.props;
    const prefixCls = props.prefixCls;
    const allowClear = props.allowClear;
    const clear = (<span key="clear"
                         className={prefixCls + '-selection__clear'}
                         onClick={this.onClearSelection}/>);
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      const placeholder = (<span key="placeholder" className={prefixCls + '-selection__placeholder'}>
                           {props.placeholder}
                         </span>);
      let innerNode = placeholder;
      if (this.state.label[0]) {
        innerNode = <span key="value">{this.state.label[0]}</span>;
      }
      return (<span className={prefixCls + '-selection__rendered'}>
        {[innerNode, allowClear ? clear : null]}
      </span>);
    }

    let selectedValueNodes;
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((singleValue, index) => {
        let content = label[index];
        const title = content;
        const maxTagTextLength = props.maxTagTextLength;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = content.slice(0, maxTagTextLength) + '...';
        }
        return (
          <li className={prefixCls + '-selection__choice'}
              key={singleValue}
              title={title}>
            <span className={prefixCls + '-selection__choice__content'}>{content}</span>
              <span className={prefixCls + '-selection__choice__remove'}
                    onClick={this.removeSelected.bind(this, singleValue)}/>
          </li>
        );
      });
    }
    return (
      <ul className={prefixCls + '-selection__rendered'}>
        {selectedValueNodes}
        {allowClear && !isMultipleOrTags(props) ? clear : null}
        <li className={`${prefixCls}-search ${prefixCls}-search--inline`}>
          {this.getInputElement()}
        </li>
      </ul>
    );
  },

  render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);
    const state = this.state;
    const prefixCls = props.prefixCls;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    if (!isCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0,
      };
    }
    const rootCls = {
      [props.className]: !!props.className,
      [prefixCls]: 1,
      [prefixCls + '-open']: state.open,
      [prefixCls + '-combobox']: isCombobox(props),
      [prefixCls + '-disabled']: props.disabled,
    };

    return (
      <SelectTrigger {...props}
        options={props.children}
        multiple={multiple}
        visible={state.open}
        inputValue={state.inputValue}
        inputElement={this.getInputElement()}
        value={state.value}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        ref="trigger">
      <span
        style={props.style}
        className={classSet(rootCls)}>
        <span ref="selection"
              key="selection"
              className={`${prefixCls}-selection ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="true"
              aria-expanded={state.open}
          {...extraSelectionProps}
        >
        {ctrlNode}
          {multiple || !props.showArrow ? null :
            (<span key="arrow" className={prefixCls + '-arrow'} tabIndex="-1" style={{outline: 'none'}}>
              <b/>
          </span>)}
          {multiple ? this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) : null}
        </span>
      </span>
      </SelectTrigger>
    );
  },
});

export default Select;
