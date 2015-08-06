import React from 'react';
import {classSet, KeyCode} from 'rc-util';
import OptGroup from './OptGroup';
import Align from 'rc-align';
import Animate from 'rc-animate';
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

class Select extends React.Component {
  constructor(props) {
    super(props);
    let value = [];
    if ('value' in props) {
      value = normValue(props.value);
    } else if ('defaultValue' in props) {
      value = normValue(props.defaultValue);
    }
    this.state = {
      value: value,
      inputValue: '',
    };
    const events = [
      'onClick',
      'getDOMNode',
      'onKeyDown',
      'onInputKeyDown',
      'onInputChange',
      'onFocus',
      'onBlur',
      'onClearSelection',
      'onMenuSelect',
      'onMenuDeselect',
    ];
    events.forEach((m)=> {
      this[m] = this[m].bind(this);
    });
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    this.saveDropdownRef = saveRef.bind(this, 'dropdownInstance');
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: normValue(nextProps.value),
      });
    }
  }

  componentDidUpdate() {
    const state = this.state;
    const props = this.props;
    if (this.haveOpened) {
      if (props.renderDropdownToBody) {
        React.render(this.getDropdownElement(), this.getDropdownContainer());
      }
    }
    if (state.open) {
      if (props.dropdownMatchSelectWidth) {
        const dropdownDOMNode = this.getDropdownDOMNode();
        if (dropdownDOMNode) {
          dropdownDOMNode.style.width = this.getDOMNode().offsetWidth + 'px';
        }
      }
      if (isMultipleOrTags(props)) {
        const inputNode = this.getInputDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = inputNode.scrollWidth + 'px';
        } else {
          inputNode.style.width = '';
        }
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

  onInputChange(e) {
    const val = e.target.value;
    const props = this.props;
    this.setState({
      inputValue: val,
      open: true,
    });
    if (isCombobox(props)) {
      props.onChange(val);
    }
    props.onSearch(val);
  }

  onClick() {
    if (!this.props.disabled) {
      if (this.state.open) {
        this.setOpenState(false);
      } else {
        this.openIfHasChildren();
      }
    }
  }

  // combobox ignore
  onKeyDown(e) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const keyCode = e.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(e);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      this.onClick();
      e.preventDefault();
    }
  }

  onInputKeyDown(e) {
    const props = this.props;
    const state = this.state;
    const keyCode = e.keyCode;
    if (isMultipleOrTags(props) && !e.target.value && keyCode === KeyCode.BACKSPACE) {
      const value = state.value.concat();
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
      const menu = this.dropdownInstance && this.dropdownInstance.refs.menu;
      if (menu && menu.onKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  onMenuSelect(key, item) {
    let value = this.state.value;
    const props = this.props;
    const selectedValue = getValuePropValue(item);
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
      inputValue: '',
    });
    this.setOpenState(false);
    if (isCombobox(props)) {
      this.setState({
        inputValue: getPropValue(item, props.optionLabelProp),
      });
    }
  }

  onMenuDeselect(key, item, e) {
    if (e.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    this.setState({
      inputValue: '',
    });
    this.setOpenState(false);
  }

  onBlur() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
    this._blurTimer = setTimeout(() => {
      this.setState({
        open: false,
      });
    }, 100);
  }

  onFocus() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
      this._blurTimer = null;
    }
  }

  onClearSelection(e) {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    e.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setState({
        inputValue: '',
      });
    }
    this.setOpenState(false);
  }

  getLabelByValue(children, value) {
    if (value === undefined) {
      return null;
    }
    let label = null;
    React.Children.forEach(children, (c) => {
      if (c.type === OptGroup) {
        const maybe = this.getLabelByValue(c.props.children, value);
        if (maybe !== null) {
          label = maybe;
        }
      } else if (getValuePropValue(c) === value) {
        label = getPropValue(c, this.props.optionLabelProp);
      }
    });
    return label;
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

  getInputElement() {
    const props = this.props;
    return (<input ref={this.saveInputRef}
                   onChange={this.onInputChange}
                   onKeyDown={this.onInputKeyDown}
                   value={this.state.inputValue}
                   disabled={props.disabled}
                   placeholder={props.searchPlaceholder}
                   className={props.prefixCls + '-search__field'}
                   role="textbox"/>);
  }

  getDropdownElement() {
    const state = this.state;
    const props = this.props;
    return (<Animate
      component=""
      exclusive={true}
      animateMount={true}
      showProp="selectOpen"
      transitionName={this.getDropdownTransitionName()}>
      <Align target={this.getDOMNode}
             key="dropdown"
             selectOpen={state.open}
             disabled={!state.open}
             align={{points: ['tl', 'bl'], offset: [0, 4]}}>
        <SelectDropdown
          key="dropdown"
          visible={state.open}
          onDropdownFocus={this.onFocus}
          onDropdownBlur={this.onBlur}
          filterOption={props.filterOption}
          optionFilterProp={props.optionFilterProp}
          optionLabelProp={props.optionLabelProp}
          inputValue={state.inputValue}
          inputElement={this.getInputElement()}
          ref={this.saveDropdownRef}
          tags={props.tags}
          notFoundContent={props.notFoundContent}
          onMenuDeselect={this.onMenuDeselect}
          onMenuSelect={this.onMenuSelect}
          value={state.value}
          isMultipleOrTags={isMultipleOrTags(props)}
          prefixCls={props.prefixCls}
          isMultipleOrTagsOrCombobox={isMultipleOrTagsOrCombobox(props)}
          showSearch={props.showSearch}
          dropdownMenuStyle={props.dropdownMenuStyle}
          dropdownStyle={props.dropdownStyle}>
          {props.children}
        </SelectDropdown>
      </Align>
    </Animate>);
  }

  getDropdownTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-dropdown-${props.animation}`;
    }
    return transitionName;
  }

  getInputDOMNode() {
    return React.findDOMNode(this.inputInstance);
  }

  getDOMNode() {
    return React.findDOMNode(this);
  }

  renderTopControlNode() {
    const value = this.state.value;
    const props = this.props;
    const prefixCls = props.prefixCls;
    const allowClear = props.allowClear;
    const children = props.children;
    const clear = (<span className={prefixCls + '-selection__clear'}
                         onClick={this.onClearSelection}/>);
    // single and not combobox, input is inside dropdown
    if (isSingleMode(props)) {
      return (<span className={prefixCls + '-selection__rendered'}>
        <span>{this.getLabelByValue(children, value[0]) || props.placeholder}</span>
        {allowClear ? clear : null}
      </span>);
    }

    let selectedValueNodes;
    if (isMultipleOrTags(props)) {
      selectedValueNodes = value.map((v) => {
        let content = this.getLabelByValue(children, v) || v;
        const title = content;
        const maxTagTextLength = props.maxTagTextLength;
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
        <li className={`${prefixCls}-search ${prefixCls}-search--inline`}>
          {this.getInputElement()}
        </li>
      </ul>
    );
  }

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
      [prefixCls + '-open']: this.state.open,
      [prefixCls + '-combobox']: isCombobox(props),
      [prefixCls + '-disabled']: props.disabled,
    };
    let dropdownElement;
    this.haveOpened = this.haveOpened || state.open;
    if (this.haveOpened) {
      dropdownElement = this.getDropdownElement();
    }
    return (
      <span
        style={props.style}
        className={classSet(rootCls)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}>
        <span ref="selection"
              key="selection"
              className={`${prefixCls}-selection ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
              role="combobox"
              aria-autocomplete="list"
              onClick={this.onClick}
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
        {props.renderDropdownToBody ? null : dropdownElement}
      </span>
    );
  }

  removeSelected(selectedValue) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    const value = this.state.value.filter((v)=> {
      return v !== selectedValue;
    });
    const canMultiple = isMultipleOrTags(props);
    if (canMultiple) {
      props.onDeselect(selectedValue);
    }
    this.fireChange(value);
  }

  setOpenState(open) {
    const refs = this.refs;
    this.setState({
      open: open,
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

  openIfHasChildren() {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  }

  fireChange(value) {
    this.props.onChange(isMultipleOrTags(this.props) ? value : value[0]);
    this.setState({
      value: value,
    });
  }
}

Select.propTypes = {
  multiple: React.PropTypes.bool,
  filterOption: React.PropTypes.any,
  showSearch: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
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
  maxTagTextLength: React.PropTypes.number,
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
  dropdownMenuStyle: {},
  renderDropdownToBody: false,
  optionFilterProp: 'value',
  optionLabelProp: 'value',
  notFoundContent: 'Not Found',
};

export default Select;
