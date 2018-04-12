/* eslint func-names: 1 */
import React from 'react';
import ReactDOM from 'react-dom';
import KeyCode from 'rc-util/lib/KeyCode';
import childrenToArray from 'rc-util/lib/Children/toArray';
import classnames from 'classnames';
import Animate from 'rc-animate';
import classes from 'component-classes';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';
import warning from 'warning';
import Option from './Option';

import {
  getPropValue,
  getValuePropValue,
  isCombobox,
  isMultipleOrTags,
  isMultipleOrTagsOrCombobox,
  isSingleMode,
  toArray,
  getMapKey,
  findIndexInValueBySingleValue,
  getLabelFromPropsValue,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  preventDefaultEvent,
  findFirstMenuItem,
  includesSeparators,
  splitBySeparators,
  defaultFilterFn,
  validateOptionValue,
  saveRef,
} from './util';
import SelectTrigger from './SelectTrigger';
import { SelectPropTypes } from './PropTypes';

function noop() {}

function chaining(...fns) {
  return function (...args) { // eslint-disable-line
    // eslint-disable-line
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(this, args);
      }
    }
  };
}

export default class Select extends React.Component {
  static propTypes = SelectPropTypes;

  static defaultProps = {
    prefixCls: 'rc-select',
    defaultOpen: false,
    labelInValue: false,
    defaultActiveFirstOption: true,
    showSearch: true,
    allowClear: false,
    placeholder: '',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
    onSearch: noop,
    onDeselect: noop,
    onInputKeyDown: noop,
    showArrow: true,
    dropdownMatchSelectWidth: true,
    dropdownStyle: {},
    dropdownMenuStyle: {},
    optionFilterProp: 'value',
    optionLabelProp: 'value',
    notFoundContent: 'Not Found',
    backfill: false,
    showAction: ['click'],
    tokenSeparators: [],
  };

  constructor(props) {
    super(props);
    const value = this.getValueFromProps(props);
    const optionsInfo = this.getOptionsInfoFromProps(props);
    let inputValue = '';
    if (props.combobox) {
      inputValue = value.length
        ? this.getLabelBySingleValue(value[0], optionsInfo)
        : '';
    }
    let open = props.open;
    if (open === undefined) {
      open = props.defaultOpen;
    }
    this.state = {
      value,
      inputValue,
      open,
      optionsInfo,
    };
    this.adjustOpenState();
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  componentWillReceiveProps = nextProps => {
    const optionsInfo = this.getOptionsInfoFromProps(nextProps);
    this.setState({
      optionsInfo,
    });
    if ('value' in nextProps) {
      const value = this.getValueFromProps(nextProps);
      this.setState({
        value,
      }, this.forcePopupAlign);
      if (nextProps.combobox) {
        this.setState({
          inputValue: value.length
            ? this.getLabelBySingleValue(value[0], optionsInfo)
            : '',
        });
      }
    }
  };

  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps;
    this.state = nextState;
    this.adjustOpenState();
  }

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
  }

  componentWillUnmount() {
    this.clearFocusTime();
    this.clearBlurTime();
    this.clearAdjustTimer();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  }

  onInputChange = event => {
    const { tokenSeparators } = this.props;
    const val = event.target.value;
    if (
      isMultipleOrTags(this.props) &&
      tokenSeparators.length &&
      includesSeparators(val, tokenSeparators)
    ) {
      const nextValue = this.getValueByInput(val);
      if (nextValue !== undefined) {
        this.fireChange(nextValue);
      }
      this.setOpenState(false, true);
      this.setInputValue('', false);
      return;
    }
    this.setInputValue(val);
    this.setState({
      open: true,
    });
    if (isCombobox(this.props)) {
      this.fireChange([val]);
    }
  };

  onDropdownVisibleChange = open => {
    if (open && !this._focused) {
      this.clearBlurTime();
      this.timeoutFocus();
      this._focused = true;
      this.updateFocusClassName();
    }
    this.setOpenState(open);
  };

  // combobox ignore
  onKeyDown = event => {
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
  };

  onInputKeyDown = event => {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const state = this.state;
    const keyCode = event.keyCode;
    if (
      isMultipleOrTags(props) &&
      !event.target.value &&
      keyCode === KeyCode.BACKSPACE
    ) {
      event.preventDefault();
      const { value } = state;
      if (value.length) {
        this.removeSelected(value[value.length - 1]);
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
      const menu = this.selectTriggerRef.getInnerMenu();
      if (menu && menu.onKeyDown(event, this.handleBackfill)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  onMenuSelect = ({ item }) => {
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const lastValue = value[value.length - 1];
    this.fireSelect(selectedValue);
    if (isMultipleOrTags(props)) {
      if (findIndexInValueBySingleValue(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([selectedValue]);
    } else {
      if (isCombobox(props)) {
        this.skipAdjustOpen = true;
        this.clearAdjustTimer();
        this.skipAdjustOpenTimer = setTimeout(() => {
          this.skipAdjustOpen = false;
        }, 0);
      }
      if (lastValue && lastValue === selectedValue && selectedValue !== this.state.backfillValue) {
        this.setOpenState(false, true);
        return;
      }
      value = [selectedValue];
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
  };

  onMenuDeselect = ({ item, domEvent }) => {
    if (domEvent.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setInputValue('', false);
  };

  onArrowClick = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!this.props.disabled) {
      this.setOpenState(!this.state.open, !this.state.open);
    }
  };

  onPlaceholderClick = () => {
    if (this.getInputDOMNode()) {
      this.getInputDOMNode().focus();
    }
  };

  onOuterFocus = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    this.clearBlurTime();
    if (
      !isMultipleOrTagsOrCombobox(this.props) &&
      e.target === this.getInputDOMNode()
    ) {
      return;
    }
    if (this._focused) {
      return;
    }
    this._focused = true;
    this.updateFocusClassName();
    this.timeoutFocus();
  };

  onPopupFocus = () => {
    // fix ie scrollbar, focus element again
    this.maybeFocus(true, true);
  };

  onOuterBlur = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    this.blurTimer = setTimeout(() => {
      this._focused = false;
      this.updateFocusClassName();
      const props = this.props;
      let { value } = this.state;
      const { inputValue } = this.state;
      if (
        isSingleMode(props) &&
        props.showSearch &&
        inputValue &&
        props.defaultActiveFirstOption
      ) {
        const options = this._options || [];
        if (options.length) {
          const firstOption = findFirstMenuItem(options);
          if (firstOption) {
            value = [firstOption.key];
            this.fireChange(value);
          }
        }
      } else if (isMultipleOrTags(props) && inputValue) {
        // why not use setState?
        this.state.inputValue = this.getInputDOMNode().value = '';

        value = this.getValueByInput(inputValue);
        if (value !== undefined) {
          this.fireChange(value);
        }
      }
      props.onBlur(this.getVLForOnChange(value));
      this.setOpenState(false);
    }, 10);
  };

  onClearSelection = event => {
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
  };

  onChoiceAnimationLeave = () => {
    this.forcePopupAlign();
  };

  getValueFromProps = props => {
    let value = [];
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    if (props.labelInValue) {
      value = value.map((v) => {
        return v.key;
      });
    }
    return value;
  }

  getOptionsInfoFromProps = props => {
    const options = this.getOptionsFromChildren(props.children);
    const oldOptionsInfo = this.state ? this.state.optionsInfo : {};
    const value = this.state ? this.state.value : [];
    const optionsInfo = {};
    options.forEach((option) => {
      const singleValue = getValuePropValue(option);
      optionsInfo[getMapKey(singleValue)] = {
        option,
        value: singleValue,
        label: this.getLabelFromOption(option),
        title: option.props.title,
      };
    });
    value.forEach(v => {
      const key = getMapKey(v);
      if (!optionsInfo[key]) {
        optionsInfo[key] = oldOptionsInfo[key];
      }
    });
    return optionsInfo;
  }

  getOptionInfoBySingleValue = (value, optionsInfo) => {
    let info;
    optionsInfo = optionsInfo || this.state.optionsInfo;
    if (optionsInfo[getMapKey(value)]) {
      info = optionsInfo[getMapKey(value)];
    }
    if (info) {
      return info;
    }
    let defaultLabel = value;
    if (this.props.labelInValue) {
      const label = getLabelFromPropsValue(this.props.value, value);
      if (label !== undefined) {
        defaultLabel = label;
      }
    }
    const defaultInfo = {
      option: <Option value={value} key={value}>{value}</Option>,
      value,
      label: defaultLabel,
    };
    return defaultInfo;
  }

  getOptionBySingleValue = value => {
    const { option } = this.getOptionInfoBySingleValue(value);
    return option;
  }

  getOptionsBySingleValue = values => {
    return values.map(value => {
      return this.getOptionBySingleValue(value);
    });
  }

  getOptionsFromChildren = (children, options = []) => {
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        this.getOptionsFromChildren(child.props.children, options);
      } else {
        options.push(child);
      }
    });
    return options;
  };

  getValueByLabel = (label) => {
    if (label === undefined) {
      return null;
    }
    let value = null;
    Object.keys(this.state.optionsInfo).forEach(key => {
      const info = this.state.optionsInfo[key];
      if (toArray(info.label).join('') === label) {
        value = info.value;
      }
    });
    return value;
  };

  getLabelFromOption = option => {
    return getPropValue(option, this.props.optionLabelProp);
  };

  getVLBySingleValue = value => {
    if (this.props.labelInValue) {
      return {
        key: value,
        label: this.getLabelBySingleValue(value),
      };
    }
    return value;
  }

  getVLForOnChange = vls_ => {
    let vls = vls_;
    if (vls !== undefined) {
      if (!this.props.labelInValue) {
        vls = vls.map(v => v);
      } else {
        vls = vls.map(vl => ({
          key: vl,
          label: this.getLabelBySingleValue(vl),
        }));
      }
      return isMultipleOrTags(this.props) ? vls : vls[0];
    }
    return vls;
  };

  getLabelBySingleValue = (value, optionsInfo) => {
    const { label } = this.getOptionInfoBySingleValue(value, optionsInfo);
    return label;
  };

  getDropdownContainer = () => {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  };

  getPlaceholderElement = () => {
    const { props, state } = this;
    let hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    if (state.value.length) {
      hidden = true;
    }
    if (isCombobox(props) && state.value.length === 1 && !state.value[0]) {
      hidden = false;
    }
    const placeholder = props.placeholder;
    if (placeholder) {
      return (
        <div
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
        </div>
      );
    }
    return null;
  };

  getInputElement = () => {
    const props = this.props;
    const inputElement = props.getInputElement
      ? props.getInputElement()
      : <input id={props.id} autoComplete="off" />;
    const inputCls = classnames(inputElement.props.className, {
      [`${props.prefixCls}-search__field`]: true,
    });
    // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
    // Add space to the end of the inputValue as the width measurement tolerance
    return (
      <div className={`${props.prefixCls}-search__field__wrap`}>
        {React.cloneElement(inputElement, {
          ref: saveRef(this, 'inputRef'),
          onChange: this.onInputChange,
          onKeyDown: chaining(
            this.onInputKeyDown,
            inputElement.props.onKeyDown,
            this.props.onInputKeyDown
          ),
          value: this.state.inputValue,
          disabled: props.disabled,
          className: inputCls,
        })}
        <span
          ref={saveRef(this, 'inputMirrorRef')}
          className={`${props.prefixCls}-search__field__mirror`}
        >
          {this.state.inputValue}&nbsp;
        </span>
      </div>
    );
  };

  getInputDOMNode = () => {
    return this.topCtrlRef
      ? this.topCtrlRef.querySelector('input,textarea,div[contentEditable]')
      : this.inputRef;
  };

  getInputMirrorDOMNode = () => {
    return this.inputMirrorRef;
  };

  getPopupDOMNode = () => {
    return this.selectTriggerRef.getPopupDOMNode();
  };

  getPopupMenuComponent = () => {
    return this.selectTriggerRef.getInnerMenu();
  };

  setOpenState = (open, needFocus) => {
    const { props, state } = this;
    if (state.open === open) {
      this.maybeFocus(open, needFocus);
      return;
    }
    const nextState = {
      open,
      backfillValue: undefined,
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
  };

  setInputValue = (inputValue, fireSearch = true) => {
    if (inputValue !== this.state.inputValue) {
      this.setState({
        inputValue,
      }, this.forcePopupAlign);
      if (fireSearch) {
        this.props.onSearch(inputValue);
      }
    }
  };

  getValueByInput = string => {
    const { multiple, tokenSeparators } = this.props;
    let nextValue = this.state.value;
    let hasNewValue = false;
    splitBySeparators(string, tokenSeparators).forEach(label => {
      const selectedValue = [label];
      if (multiple) {
        const value = this.getValueByLabel(label);
        if (value && findIndexInValueBySingleValue(nextValue, value) === -1) {
          nextValue = nextValue.concat(value);
          hasNewValue = true;
          this.fireSelect(value);
        }
      } else {
        // tag
        if (findIndexInValueBySingleValue(nextValue, label) === -1) {
          nextValue = nextValue.concat(selectedValue);
          hasNewValue = true;
          this.fireSelect(label);
        }
      }
    });
    return hasNewValue ? nextValue : undefined;
  };

  focus() {
    if (isSingleMode(this.props)) {
      this.selectionRef.focus();
    } else {
      this.getInputDOMNode().focus();
    }
  }

  blur() {
    if (isSingleMode(this.props)) {
      this.selectionRef.blur();
    } else {
      this.getInputDOMNode().blur();
    }
  }

  handleBackfill = (item) => {
    if (!this.props.backfill || !(isSingleMode(this.props) || isCombobox(this.props))) {
      return;
    }

    const key = getValuePropValue(item);

    if (isCombobox(this.props)) {
      this.setInputValue(key, false);
    }

    this.setState({
      value: [key],
      backfillValue: key,
    });
  };

  filterOption = (input, child, defaultFilter = defaultFilterFn) => {
    const { value } = this.state;
    const lastValue = value[value.length - 1];
    if (!input || (lastValue && lastValue === this.state.backfillValue)) {
      return true;
    }
    let filterFn = this.props.filterOption;
    if ('filterOption' in this.props) {
      if (this.props.filterOption === true) {
        filterFn = defaultFilter;
      }
    } else {
      filterFn = defaultFilter;
    }

    if (!filterFn) {
      return true;
    } else if (typeof filterFn === 'function') {
      return filterFn.call(this, input, child);
    } else if (child.props.disabled) {
      return false;
    }
    return true;
  };

  timeoutFocus = () => {
    if (this.focusTimer) {
      this.clearFocusTime();
    }
    this.focusTimer = setTimeout(() => {
      this.props.onFocus();
    }, 10);
  };

  clearFocusTime = () => {
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
      this.focusTimer = null;
    }
  };

  clearBlurTime = () => {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  };

  clearAdjustTimer = () => {
    if (this.skipAdjustOpenTimer) {
      clearTimeout(this.skipAdjustOpenTimer);
      this.skipAdjustOpenTimer = null;
    }
  };

  updateFocusClassName = () => {
    const { rootRef, props } = this;
    // avoid setState and its side effect
    if (this._focused) {
      classes(rootRef).add(`${props.prefixCls}-focused`);
    } else {
      classes(rootRef).remove(`${props.prefixCls}-focused`);
    }
  };

  maybeFocus = (open, needFocus) => {
    if (needFocus || open) {
      const input = this.getInputDOMNode();
      const { activeElement } = document;
      if (input && (open || isMultipleOrTagsOrCombobox(this.props))) {
        if (activeElement !== input) {
          input.focus();
          this._focused = true;
        }
      } else {
        if (activeElement !== this.selectionRef) {
          this.selectionRef.focus();
          this._focused = true;
        }
      }
    }
  };

  removeSelected = selectedKey => {
    const props = this.props;
    if (props.disabled || this.isChildDisabled(selectedKey)) {
      return;
    }
    const value = this.state.value.filter(singleValue => {
      return singleValue !== selectedKey;
    });
    const canMultiple = isMultipleOrTags(props);

    if (canMultiple) {
      let event = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey,
          label: this.getLabelBySingleValue(selectedKey),
        };
      }
      props.onDeselect(event, this.getOptionBySingleValue(selectedKey));
    }
    this.fireChange(value);
  };

  openIfHasChildren = () => {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  };

  fireSelect = value => {
    this.props.onSelect(this.getVLBySingleValue(value), this.getOptionBySingleValue(value));
  };

  fireChange = value => {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({
        value,
      }, this.forcePopupAlign);
    }
    const vls = this.getVLForOnChange(value);
    const options = this.getOptionsBySingleValue(value);
    props.onChange(vls, isMultipleOrTags(this.props) ? options : options[0]);
  };

  isChildDisabled = key => {
    return childrenToArray(this.props.children).some(child => {
      const childValue = getValuePropValue(child);
      return childValue === key && child.props && child.props.disabled;
    });
  };

  adjustOpenState = () => {
    if (this.skipAdjustOpen) {
      return;
    }
    let { open } = this.state;
    let options = [];
    // If hidden menu due to no options, then it should be calculated again
    if (open || this.hiddenForNoOptions) {
      options = this.renderFilterOptions();
    }
    this._options = options;

    if (isMultipleOrTagsOrCombobox(this.props) || !this.props.showSearch) {
      if (open && !options.length) {
        open = false;
        this.hiddenForNoOptions = true;
      }
      // Keep menu open if there are options and hidden for no options before
      if (this.hiddenForNoOptions && options.length) {
        open = true;
        this.hiddenForNoOptions = false;
      }
    }
    this.state.open = open;
  };

  forcePopupAlign = () => {
    this.selectTriggerRef.triggerRef.forcePopupAlign();
  };

  renderFilterOptions = () => {
    const { inputValue } = this.state;
    const { children, tags, filterOption, notFoundContent } = this.props;
    const menuItems = [];
    const childrenKeys = [];
    let options = this.renderFilterOptionsFromChildren(
      children,
      childrenKeys,
      menuItems,
    );
    if (tags) {
      // tags value must be string
      let value = this.state.value || [];
      value = value.filter(singleValue => {
        return (
          childrenKeys.indexOf(singleValue) === -1 &&
          (!inputValue ||
            String(singleValue).indexOf(String(inputValue)) > -1)
        );
      });
      value.forEach(singleValue => {
        const key = singleValue;
        const menuItem = (
          <MenuItem
            style={UNSELECTABLE_STYLE}
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={key}
            key={key}
          >
            {key}
          </MenuItem>
        );
        options.push(menuItem);
        menuItems.push(menuItem);
      });
      if (inputValue) {
        const notFindInputItem = menuItems.every(option => {
          // this.filterOption return true has two meaning,
          // 1, some one exists after filtering
          // 2, filterOption is set to false
          // condition 2 does not mean the option has same value with inputValue
          const filterFn = () => getValuePropValue(option) === inputValue;
          if (filterOption !== false) {
            return !this.filterOption.call(
              this,
              inputValue,
              option,
              filterFn
            );
          }
          return !filterFn();
        });
        if (notFindInputItem) {
          options.unshift(
            <MenuItem
              style={UNSELECTABLE_STYLE}
              attribute={UNSELECTABLE_ATTRIBUTE}
              value={inputValue}
              key={inputValue}
            >
              {inputValue}
            </MenuItem>
          );
        }
      }
    }

    if (!options.length && notFoundContent) {
      options = [
        <MenuItem
          style={UNSELECTABLE_STYLE}
          attribute={UNSELECTABLE_ATTRIBUTE}
          disabled
          value="NOT_FOUND"
          key="NOT_FOUND"
        >
          {notFoundContent}
        </MenuItem>,
      ];
    }
    return options;
  };

  renderFilterOptionsFromChildren = (children, childrenKeys, menuItems) => {
    const sel = [];
    const props = this.props;
    const { inputValue } = this.state;
    const tags = props.tags;
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }
      if (child.type.isSelectOptGroup) {
        const innerItems = this.renderFilterOptionsFromChildren(
          child.props.children,
          childrenKeys,
          menuItems,
        );
        if (innerItems.length) {
          let label = child.props.label;
          let key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          sel.push(
            <MenuItemGroup key={key} title={label}>
              {innerItems}
            </MenuItemGroup>
          );
        }
        return;
      }

      warning(
        child.type.isSelectOption,
        'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
          `instead of \`${child.type.name ||
            child.type.displayName ||
            child.type}\`.`
      );

      const childValue = getValuePropValue(child);

      validateOptionValue(childValue, this.props);

      if (this.filterOption(inputValue, child)) {
        const menuItem = (
          <MenuItem
            style={UNSELECTABLE_STYLE}
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={childValue}
            key={childValue}
            {...child.props}
          />
        );
        sel.push(menuItem);
        menuItems.push(menuItem);
      }
      if (tags && !child.props.disabled) {
        childrenKeys.push(childValue);
      }
    });

    return sel;
  };

  renderTopControlNode = () => {
    const { value, open, inputValue } = this.state;
    const props = this.props;
    const {
      choiceTransitionName,
      prefixCls,
      maxTagTextLength,
      maxTagCount,
      maxTagPlaceholder,
      showSearch,
    } = props;
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
        const { label, title } = this.getOptionInfoBySingleValue(singleValue);
        selectedValue = (
          <div
            key="value"
            className={`${prefixCls}-selection-selected-value`}
            title={title || label}
            style={{
              display: showSelectedValue ? 'block' : 'none',
              opacity,
            }}
          >
            {label}
          </div>
        );
      }
      if (!showSearch) {
        innerNode = [selectedValue];
      } else {
        innerNode = [
          selectedValue,
          <div
            className={`${prefixCls}-search ${prefixCls}-search--inline`}
            key="input"
            style={{
              display: open ? 'block' : 'none',
            }}
          >
            {this.getInputElement()}
          </div>,
        ];
      }
    } else {
      let selectedValueNodes = [];
      let limitedCountValue = value;
      let maxTagPlaceholderEl;
      if (maxTagCount !== undefined && value.length > maxTagCount) {
        limitedCountValue = limitedCountValue.slice(0, maxTagCount);
        const omittedValues = this.getVLForOnChange(value.slice(maxTagCount, value.length));
        let content = `+ ${value.length - maxTagCount} ...`;
        if (maxTagPlaceholder) {
          content = typeof maxTagPlaceholder === 'function' ?
            maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
        }
        maxTagPlaceholderEl = (<li
          style={UNSELECTABLE_STYLE}
          {...UNSELECTABLE_ATTRIBUTE}
          onMouseDown={preventDefaultEvent}
          className={`${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`}
          key={'maxTagPlaceholder'}
          title={content}
        >
          <div className={`${prefixCls}-selection__choice__content`}>{content}</div>
        </li>);
      }
      if (isMultipleOrTags(props)) {
        selectedValueNodes = limitedCountValue.map(singleValue => {
          const info = this.getOptionInfoBySingleValue(singleValue);
          let content = info.label;
          const title = info.title || content;
          if (
            maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength
          ) {
            content = `${content.slice(0, maxTagTextLength)}...`;
          }
          const disabled = this.isChildDisabled(singleValue);
          const choiceClassName = disabled
            ? `${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`
            : `${prefixCls}-selection__choice`;
          return (
            <li
              style={UNSELECTABLE_STYLE}
              {...UNSELECTABLE_ATTRIBUTE}
              onMouseDown={preventDefaultEvent}
              className={choiceClassName}
              key={singleValue}
              title={title}
            >
              <div className={`${prefixCls}-selection__choice__content`}>
                {content}
              </div>
              {disabled ? null : (
                <span
                  className={`${prefixCls}-selection__choice__remove`}
                  onClick={this.removeSelected.bind(this, singleValue)}
                />)}
            </li>
          );
        });
      }
      if (maxTagPlaceholderEl) {
        selectedValueNodes.push(maxTagPlaceholderEl);
      }
      selectedValueNodes.push(
        <li
          className={`${prefixCls}-search ${prefixCls}-search--inline`}
          key="__input"
        >
          {this.getInputElement()}
        </li>
      );

      if (isMultipleOrTags(props) && choiceTransitionName) {
        innerNode = (
          <Animate
            onLeave={this.onChoiceAnimationLeave}
            component="ul"
            transitionName={choiceTransitionName}
          >
            {selectedValueNodes}
          </Animate>
        );
      } else {
        innerNode = (
          <ul>
            {selectedValueNodes}
          </ul>
        );
      }
    }
    return (
      <div className={className} ref={saveRef(this, 'topCtrlRef')}>
        {this.getPlaceholderElement()}
        {innerNode}
      </div>
    );
  }

  renderClear() {
    const { prefixCls, allowClear } = this.props;
    const { value, inputValue } = this.state;
    const clear = (
      <span
        key="clear"
        onMouseDown={preventDefaultEvent}
        style={UNSELECTABLE_STYLE}
        {...UNSELECTABLE_ATTRIBUTE}
        className={`${prefixCls}-selection__clear`}
        onClick={this.onClearSelection}
      />
    );
    if (!allowClear) {
      return null;
    }
    if (isCombobox(this.props)) {
      if (inputValue) {
        return clear;
      }
      return null;
    }
    if (inputValue || value.length) {
      return clear;
    }
    return null;
  }

  render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);
    const state = this.state;
    const { className, disabled, prefixCls } = props;
    const ctrlNode = this.renderTopControlNode();
    let extraSelectionProps = {};
    const { open } = this.state;
    const options = this._options;
    if (!isMultipleOrTagsOrCombobox(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: props.disabled ? -1 : 0,
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
    return (
      <SelectTrigger
        onPopupFocus={this.onPopupFocus}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
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
        backfillValue={state.backfillValue}
        firstActiveValue={props.firstActiveValue}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={props.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        onPopupScroll={props.onPopupScroll}
        showAction={props.showAction}
        ref={saveRef(this, 'selectTriggerRef')}
      >
        <div
          style={props.style}
          ref={saveRef(this, 'rootRef')}
          onBlur={this.onOuterBlur}
          onFocus={this.onOuterFocus}
          className={classnames(rootCls)}
        >
          <div
            ref={saveRef(this, 'selectionRef')}
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
            {this.renderClear()}
            {multiple || !props.showArrow ? null : (
              <span
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
  }
}

Select.displayName = 'Select';
