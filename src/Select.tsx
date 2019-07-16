import classnames from 'classnames';
import classes from 'component-classes';
import Animate from 'rc-animate';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from 'rc-menu';
import childrenToArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { polyfill } from 'react-lifecycles-compat';
import warning from 'warning';
import OptGroup from './OptGroup';
import Option from './Option';

import SelectPropTypes, { IILableValueType, ISelectProps, valueType } from './PropTypes';
import SelectTrigger from './SelectTrigger';
import {
  defaultFilterFn,
  findFirstMenuItem,
  findIndexInValueBySingleValue,
  generateUUID,
  getLabelFromPropsValue,
  getMapKey,
  getPropValue,
  getValuePropValue,
  includesSeparators,
  isCombobox,
  isMultipleOrTags,
  isMultipleOrTagsOrCombobox,
  isSingleMode,
  preventDefaultEvent,
  saveRef,
  splitBySeparators,
  toArray,
  toTitle,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  validateOptionValue,
} from './util';

const SELECT_EMPTY_VALUE_KEY = 'RC_SELECT_EMPTY_VALUE_KEY';

const noop = () => null;

function chaining(...fns: any[]) {
  return (...args: any[]) => {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(chaining, args);
      }
    }
  };
}

export interface ISelectState {
  open: boolean;
  value?: valueType;
  inputValue?: string;
  skipBuildOptionsInfo?: boolean;
  optionsInfo?: any;
  backfillValue?: string;
  ariaId?: string;
}

class Select extends React.Component<Partial<ISelectProps>, ISelectState> {
  public static propTypes = SelectPropTypes;
  public static Option: typeof Option;
  public static OptGroup: typeof OptGroup;
  public static displayName: string;
  public static defaultProps = {
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
    dropdownMatchSelectWidth: true,
    dropdownStyle: {},
    dropdownMenuStyle: {},
    optionFilterProp: 'value',
    optionLabelProp: 'value',
    notFoundContent: 'Not Found',
    backfill: false,
    showAction: ['click'],
    tokenSeparators: [],
    autoClearSearchValue: true,
    tabIndex: 0,
    dropdownRender: (menu: any) => menu,
  };
  public static getDerivedStateFromProps = (nextProps: ISelectProps, prevState: ISelectState) => {
    const optionsInfo = prevState.skipBuildOptionsInfo
      ? prevState.optionsInfo
      : Select.getOptionsInfoFromProps(nextProps, prevState);

    const newState: Partial<ISelectState> = {
      optionsInfo,
      skipBuildOptionsInfo: false,
    };

    if ('open' in nextProps) {
      newState.open = nextProps.open;
    }

    if ('value' in nextProps) {
      const value = Select.getValueFromProps(nextProps);
      newState.value = value;
      if (nextProps.combobox) {
        newState.inputValue = Select.getInputValueForCombobox(nextProps, optionsInfo);
      }
    }
    return newState;
  };

  public static getOptionsFromChildren = (
    children: Array<React.ReactElement<any>>,
    options: any[] = [],
  ) => {
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }
      const type = (child as React.ReactElement<any>).type as any;
      if (type.isSelectOptGroup) {
        Select.getOptionsFromChildren((child as React.ReactElement<any>).props.children, options);
      } else {
        options.push(child);
      }
    });
    return options;
  };

  public static getInputValueForCombobox = (
    props: Partial<ISelectProps>,
    optionsInfo: any,
    useDefaultValue?: boolean,
  ) => {
    let value: valueType | undefined = [];
    if ('value' in props && !useDefaultValue) {
      value = toArray(props.value);
    }
    if ('defaultValue' in props && useDefaultValue) {
      value = toArray(props.defaultValue);
    }
    if ((value as string[]).length) {
      value = (value as string[])[0];
    } else {
      return '';
    }
    let label = value;
    if (props.labelInValue) {
      label = (value as IILableValueType).label as string;
    } else if (optionsInfo[getMapKey(value)]) {
      label = optionsInfo[getMapKey(value)].label;
    }
    if (label === undefined) {
      label = '';
    }
    return label;
  };

  public static getLabelFromOption = (props: Partial<ISelectProps>, option: any) => {
    return getPropValue(option, props.optionLabelProp);
  };

  public static getOptionsInfoFromProps = (
    props: Partial<ISelectProps>,
    preState?: ISelectState,
  ) => {
    const options = Select.getOptionsFromChildren(props.children);
    const optionsInfo = {};
    options.forEach(option => {
      const singleValue = getValuePropValue(option);
      optionsInfo[getMapKey(singleValue)] = {
        option,
        value: singleValue,
        label: Select.getLabelFromOption(props, option),
        title: option.props.title,
        disabled: option.props.disabled,
      };
    });
    if (preState) {
      // keep option info in pre state value.
      const oldOptionsInfo = preState.optionsInfo;
      const value = preState.value;
      if (value) {
        (value as string[]).forEach(v => {
          const key = getMapKey(v);
          if (!optionsInfo[key] && oldOptionsInfo[key] !== undefined) {
            optionsInfo[key] = oldOptionsInfo[key];
          }
        });
      }
    }
    return optionsInfo;
  };

  public static getValueFromProps = (props: Partial<ISelectProps>, useDefaultValue?: boolean) => {
    let value: valueType | undefined = [];
    if ('value' in props && !useDefaultValue) {
      value = toArray(props.value);
    }
    if ('defaultValue' in props && useDefaultValue) {
      value = toArray(props.defaultValue);
    }
    if (props.labelInValue) {
      value = (value as IILableValueType[]).map(v => {
        return v.key as string;
      });
    }
    return value;
  };

  public saveInputRef: (ref: HTMLInputElement) => void;
  public saveInputMirrorRef: (ref: HTMLSpanElement) => void;
  public saveTopCtrlRef: (ref: HTMLDivElement) => void;
  public saveSelectTriggerRef: (ref: SelectTrigger) => void;
  public saveRootRef: (ref: HTMLDivElement) => void;
  public saveSelectionRef: (ref: HTMLDivElement) => void;
  public inputRef: HTMLInputElement | null = null;
  public inputMirrorRef: HTMLSpanElement | null = null;
  public topCtrlRef: HTMLDivElement | null = null;
  public selectTriggerRef: SelectTrigger | null = null;
  public rootRef: HTMLDivElement | null = null;
  public selectionRef: HTMLDivElement | null = null;
  public dropdownContainer: Element | null = null;
  public blurTimer: number | null = null;
  public focusTimer: number | null = null;
  public comboboxTimer: number | null = null;

  // tslint:disable-next-line:variable-name
  private _focused: boolean = false;
  // tslint:disable-next-line:variable-name
  private _mouseDown: boolean = false;
  // tslint:disable-next-line:variable-name
  private _options: JSX.Element[] = [];
  // tslint:disable-next-line:variable-name
  private _empty: boolean = false;
  constructor(props: Partial<ISelectProps>) {
    super(props);
    const optionsInfo = Select.getOptionsInfoFromProps(props);
    if (props.tags && typeof props.filterOption !== 'function') {
      const isDisabledExist = Object.keys(optionsInfo).some(key => optionsInfo[key].disabled);
      warning(
        !isDisabledExist,
        'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
      );
    }
    this.state = {
      value: Select.getValueFromProps(props, true), // true: use default value
      inputValue: props.combobox
        ? Select.getInputValueForCombobox(
            props,
            optionsInfo,
            true, // use default value
          )
        : '',
      open: props.defaultOpen as boolean,
      optionsInfo,
      backfillValue: '',
      // a flag for aviod redundant getOptionsInfoFromProps call
      skipBuildOptionsInfo: true,
      ariaId: '',
    };

    this.saveInputRef = saveRef(this, 'inputRef');
    this.saveInputMirrorRef = saveRef(this, 'inputMirrorRef');
    this.saveTopCtrlRef = saveRef(this, 'topCtrlRef');
    this.saveSelectTriggerRef = saveRef(this, 'selectTriggerRef');
    this.saveRootRef = saveRef(this, 'rootRef');
    this.saveSelectionRef = saveRef(this, 'selectionRef');
  }

  public componentDidMount() {
    // when defaultOpen is true, we should auto focus search input
    // https://github.com/ant-design/ant-design/issues/14254
    if (this.props.autoFocus || this.state.open) {
      this.focus();
    }
    this.setState({
      ariaId: generateUUID(),
    });
  }

  public componentDidUpdate() {
    if (isMultipleOrTags(this.props)) {
      const inputNode = this.getInputDOMNode();
      const mirrorNode = this.getInputMirrorDOMNode();
      if (inputNode && inputNode.value && mirrorNode) {
        inputNode.style.width = '';
        inputNode.style.width = `${mirrorNode.clientWidth}px`;
      } else if (inputNode) {
        inputNode.style.width = '';
      }
    }
    this.forcePopupAlign();
  }
  public componentWillUnmount() {
    this.clearFocusTime();
    this.clearBlurTime();
    this.clearComboboxTime();
    if (this.dropdownContainer) {
      ReactDOM.unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  }

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tokenSeparators = this.props.tokenSeparators as string[];
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
      this.setOpenState(false, { needFocus: true });
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

  public onDropdownVisibleChange = (open: boolean) => {
    if (open && !this._focused) {
      this.clearBlurTime();
      this.timeoutFocus();
      this._focused = true;
      this.updateFocusClassName();
    }
    this.setOpenState(open);
  };

  // combobox ignore
  public onKeyDown = (event: KeyboardEvent) => {
    const { open } = this.state;
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    const keyCode = event.keyCode;
    if (open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
      if (!open) {
        this.setOpenState(true);
      }
      event.preventDefault();
    } else if (keyCode === KeyCode.SPACE) {
      // Not block space if popup is shown
      if (!open) {
        this.setOpenState(true);
        event.preventDefault();
      }
    }
  };

  public onInputKeyDown = (event: React.ChangeEvent<HTMLInputElement> | KeyboardEvent) => {
    const { disabled, combobox, defaultActiveFirstOption } = this.props;
    if (disabled) {
      return;
    }
    const state = this.state;
    const isRealOpen = this.getRealOpenState(state);

    // magic code
    const keyCode = (event as KeyboardEvent).keyCode;
    if (
      isMultipleOrTags(this.props) &&
      !(event as React.ChangeEvent<HTMLInputElement>).target.value &&
      keyCode === KeyCode.BACKSPACE
    ) {
      event.preventDefault();
      const value = state.value as string[];
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
    } else if (keyCode === KeyCode.ENTER && state.open) {
      // Aviod trigger form submit when select item
      // https://github.com/ant-design/ant-design/issues/10861
      // https://github.com/ant-design/ant-design/issues/14544
      if (isRealOpen || !combobox) {
        event.preventDefault();
      }

      // Hard close popup to avoid lock of non option in combobox mode
      if (isRealOpen && combobox && defaultActiveFirstOption === false) {
        this.comboboxTimer = setTimeout(() => {
          this.setOpenState(false);
        });
      }
    } else if (keyCode === KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (isRealOpen && this.selectTriggerRef) {
      const menu = this.selectTriggerRef.getInnerMenu();
      if (menu && menu.onKeyDown(event, this.handleBackfill)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  public onMenuSelect = ({ item }: { item: Option }) => {
    if (!item) {
      return;
    }

    let value = this.state.value as string[];
    const props = this.props;
    const selectedValue = getValuePropValue(item);
    const lastValue = value[value.length - 1];

    if (isMultipleOrTags(props)) {
      if (findIndexInValueBySingleValue(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([selectedValue]);
    } else {
      if (
        !isCombobox(props) &&
        lastValue !== undefined &&
        lastValue === selectedValue &&
        selectedValue !== this.state.backfillValue
      ) {
        this.setOpenState(false, { needFocus: true, fireSearch: false });
        return;
      }
      value = [selectedValue];
      this.setOpenState(false, { needFocus: true, fireSearch: false });
    }

    this.fireChange(value);
    this.fireSelect(selectedValue);
    const inputValue = isCombobox(props) ? getPropValue(item, props.optionLabelProp) : '';

    if (props.autoClearSearchValue) {
      this.setInputValue(inputValue, false);
    }
  };

  public onMenuDeselect = ({ item, domEvent }: { item: any; domEvent: KeyboardEvent }) => {
    if (domEvent.type === 'keydown' && domEvent.keyCode === KeyCode.ENTER) {
      this.removeSelected(getValuePropValue(item));
      return;
    }
    if (domEvent.type === 'click') {
      this.removeSelected(getValuePropValue(item));
    }
    const props = this.props;
    if (props.autoClearSearchValue) {
      this.setInputValue('');
    }
  };

  public onArrowClick = (e: React.MouseEvent<HTMLIFrameElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!this.props.disabled) {
      this.setOpenState(!this.state.open, { needFocus: !this.state.open });
    }
  };

  public onPlaceholderClick = () => {
    if (this.getInputDOMNode && this.getInputDOMNode()) {
      (this.getInputDOMNode() as HTMLInputElement).focus();
    }
  };

  public onOuterFocus = (
    e: React.FocusEvent<HTMLDivElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    this.clearBlurTime();

    // In IE11, onOuterFocus will be trigger twice when focus input
    // First one: e.target is div
    // Second one: e.target is input
    // other browser only trigger second one
    // https://github.com/ant-design/ant-design/issues/15942
    // Here we ignore the first one when e.target is div
    const inputNode = this.getInputDOMNode();
    if (inputNode && e.target === this.rootRef) {
      return;
    }

    if (!isMultipleOrTagsOrCombobox(this.props) && e.target === inputNode) {
      return;
    }
    if (this._focused) {
      return;
    }
    this._focused = true;
    this.updateFocusClassName();
    // only effect multiple or tag mode
    if (!isMultipleOrTags(this.props) || !this._mouseDown) {
      this.timeoutFocus();
    }
  };

  public onPopupFocus = () => {
    // fix ie scrollbar, focus element again
    this.maybeFocus(true, true);
  };

  public onOuterBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    this.blurTimer = window.setTimeout(() => {
      this._focused = false;
      this.updateFocusClassName();
      const props = this.props;
      let { value } = this.state;
      const { inputValue } = this.state;
      if (isSingleMode(props) && props.showSearch && inputValue && props.defaultActiveFirstOption) {
        const options = this._options || [];
        if (options.length) {
          const firstOption = findFirstMenuItem(options);
          if (firstOption) {
            value = [getValuePropValue(firstOption)];
            this.fireChange(value);
          }
        }
      } else if (isMultipleOrTags(props) && inputValue) {
        if (this._mouseDown) {
          // need update dropmenu when not blur
          this.setInputValue('');
        } else {
          // why not use setState?
          // https://github.com/ant-design/ant-design/issues/14262
          (this.state as any).inputValue = '';
          if (this.getInputDOMNode && this.getInputDOMNode()) {
            (this.getInputDOMNode() as HTMLInputElement).value = '';
          }
        }
        const tmpValue = this.getValueByInput(inputValue);
        if (tmpValue !== undefined) {
          value = tmpValue;
          this.fireChange(value);
        }
      }

      // if click the rest space of Select in multiple mode
      if (isMultipleOrTags(props) && this._mouseDown) {
        this.maybeFocus(true, true);
        this._mouseDown = false;
        return;
      }
      this.setOpenState(false);
      if (props.onBlur) {
        props.onBlur(this.getVLForOnChange(value as valueType));
      }
    }, 10);
  };

  public onClearSelection = (event: Event) => {
    const props = this.props;
    const state = this.state;
    if (props.disabled) {
      return;
    }
    const { inputValue } = state;
    const value = state.value as string[];
    event.stopPropagation();
    if (inputValue || value.length) {
      if (value.length) {
        this.fireChange([]);
      }
      this.setOpenState(false, { needFocus: true });
      if (inputValue) {
        this.setInputValue('');
      }
    }
  };

  public onChoiceAnimationLeave = () => {
    this.forcePopupAlign();
  };

  public getOptionInfoBySingleValue = (value: valueType, optionsInfo?: any) => {
    let info: any;
    optionsInfo = optionsInfo || this.state.optionsInfo;
    if (optionsInfo[getMapKey(value)]) {
      info = optionsInfo[getMapKey(value)];
    }
    if (info) {
      return info;
    }
    let defaultLabel = value;
    if (this.props.labelInValue) {
      const valueLabel = getLabelFromPropsValue(this.props.value, value);
      const defaultValueLabel = getLabelFromPropsValue(this.props.defaultValue, value);
      if (valueLabel !== undefined) {
        defaultLabel = valueLabel;
      } else if (defaultValueLabel !== undefined) {
        defaultLabel = defaultValueLabel;
      }
    }
    const defaultInfo = {
      option: (
        <Option value={value as string} key={value as string}>
          {value}
        </Option>
      ),
      value,
      label: defaultLabel,
    };
    return defaultInfo;
  };

  public getOptionBySingleValue = (value: valueType) => {
    const { option } = this.getOptionInfoBySingleValue(value);
    return option;
  };

  public getOptionsBySingleValue = (values: valueType) => {
    return (values as string[]).map(value => {
      return this.getOptionBySingleValue(value);
    });
  };

  public getValueByLabel = (label?: string) => {
    if (label === undefined) {
      return null;
    }
    let value = null;
    Object.keys(this.state.optionsInfo).forEach(key => {
      const info = this.state.optionsInfo[key];
      const { disabled } = info;
      if (disabled) {
        return;
      }
      const oldLable = toArray(info.label) as string[];
      if (oldLable && oldLable.join('') === label) {
        value = info.value;
      }
    });
    return value;
  };

  public getVLBySingleValue = (value: valueType) => {
    if (this.props.labelInValue) {
      return {
        key: value,
        label: this.getLabelBySingleValue(value),
      };
    }
    return value;
  };

  public getVLForOnChange = (vlsS: valueType) => {
    let vls = vlsS;
    if (vls !== undefined) {
      if (!this.props.labelInValue) {
        vls = (vls as Array<{ key: string | number; label?: React.ReactNode }>).map((v: any) => v);
      } else {
        vls = (vls as string[]).map((vl: string) => ({
          key: vl,
          label: this.getLabelBySingleValue(vl),
        }));
      }
      return isMultipleOrTags(this.props) ? vls : vls[0];
    }
    return vls;
  };

  public getLabelBySingleValue = (value: valueType, optionsInfo?: any) => {
    const { label } = this.getOptionInfoBySingleValue(value, optionsInfo);
    return label;
  };

  public getDropdownContainer = () => {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  };

  public getPlaceholderElement = () => {
    const props = this.props;
    const state = this.state;
    let hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    const value = state.value as string[];
    if (value.length) {
      hidden = true;
    }
    if (isCombobox(props) && value.length === 1 && (state.value && !state.value[0])) {
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

  public getInputElement = () => {
    const props = this.props;
    const defaultInput = <input id={props.id} autoComplete="off" />;
    // tslint:disable-next-line:typedef-whitespace
    const inputElement: JSX.Element = props.getInputElement
      ? props.getInputElement()
      : defaultInput;
    const inputCls = classnames(inputElement.props.className, {
      [`${props.prefixCls}-search__field`]: true,
    });
    // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
    // Add space to the end of the inputValue as the width measurement tolerance
    return (
      <div className={`${props.prefixCls}-search__field__wrap`}>
        {React.cloneElement(inputElement, {
          ref: this.saveInputRef,
          onChange: this.onInputChange,
          onKeyDown: chaining(
            this.onInputKeyDown,
            inputElement.props.onKeyDown,
            this.props.onInputKeyDown,
          ),
          value: this.state.inputValue,
          disabled: props.disabled,
          className: inputCls,
        })}
        <span ref={this.saveInputMirrorRef} className={`${props.prefixCls}-search__field__mirror`}>
          {this.state.inputValue}&nbsp;
        </span>
      </div>
    );
  };

  public getInputDOMNode = (): HTMLInputElement | null => {
    return this.topCtrlRef
      ? this.topCtrlRef.querySelector('input,textarea,div[contentEditable]')
      : this.inputRef;
  };

  public getInputMirrorDOMNode = () => {
    return this.inputMirrorRef;
  };

  public getPopupDOMNode = () => {
    if (this.selectTriggerRef) {
      return this.selectTriggerRef.getPopupDOMNode();
    }
  };

  public getPopupMenuComponent = () => {
    if (this.selectTriggerRef) {
      return this.selectTriggerRef.getInnerMenu();
    }
  };

  public setOpenState = (
    open: boolean,
    config: { needFocus?: boolean; fireSearch?: boolean } = {},
  ) => {
    const { needFocus, fireSearch } = config;
    const props = this.props;
    const state = this.state;

    if (state.open === open) {
      this.maybeFocus(open, !!needFocus);
      return;
    }

    if (this.props.onDropdownVisibleChange) {
      this.props.onDropdownVisibleChange(open as boolean);
    }

    const nextState: ISelectState = {
      open,
      backfillValue: '',
    };
    // clear search input value when open is false in singleMode.
    // https://github.com/ant-design/ant-design/issues/16572
    if (!open && isSingleMode(props) && props.showSearch) {
      this.setInputValue('', fireSearch);
    }
    if (!open) {
      this.maybeFocus(open, !!needFocus);
    }
    this.setState(
      {
        open,
        ...nextState,
      },
      () => {
        if (open) {
          this.maybeFocus(open, !!needFocus);
        }
      },
    );
  };

  public setInputValue = (inputValue: string, fireSearch = true) => {
    const { onSearch } = this.props;
    if (inputValue !== this.state.inputValue) {
      this.setState(prevState => {
        // Additional check if `inputValue` changed in latest state.
        if (fireSearch && inputValue !== prevState.inputValue && onSearch) {
          onSearch(inputValue);
        }
        return { inputValue };
      }, this.forcePopupAlign);
    }
  };

  public getValueByInput = (str: string | string[]) => {
    const { multiple, tokenSeparators } = this.props;
    let nextValue = this.state.value;
    let hasNewValue = false;
    splitBySeparators(str, tokenSeparators as string[]).forEach(label => {
      const selectedValue = [label];
      if (multiple) {
        const value = this.getValueByLabel(label);
        if (value && findIndexInValueBySingleValue(nextValue, value) === -1) {
          nextValue = (nextValue as string).concat(value);
          hasNewValue = true;
          this.fireSelect(value);
        }
      } else if (findIndexInValueBySingleValue(nextValue, label) === -1) {
        nextValue = (nextValue as string[]).concat(selectedValue);
        hasNewValue = true;
        this.fireSelect(label);
      }
    });
    return hasNewValue ? nextValue : undefined;
  };

  public getRealOpenState = (state?: ISelectState) => {
    // tslint:disable-next-line:variable-name
    const { open: _open } = this.props;
    if (typeof _open === 'boolean') {
      return _open;
    }
    let open = (state || this.state).open;
    const options = this._options || [];
    if (isMultipleOrTagsOrCombobox(this.props) || !this.props.showSearch) {
      if (open && !options.length) {
        open = false;
      }
    }
    return open;
  };

  public focus() {
    if (isSingleMode(this.props) && this.selectionRef) {
      this.selectionRef.focus();
    } else if (this.getInputDOMNode()) {
      (this.getInputDOMNode() as HTMLInputElement).focus();
    }
  }

  public blur() {
    if (isSingleMode(this.props) && this.selectionRef) {
      this.selectionRef.blur();
    } else if (this.getInputDOMNode()) {
      (this.getInputDOMNode() as HTMLInputElement).blur();
    }
  }

  public markMouseDown = () => {
    this._mouseDown = true;
  };

  public markMouseLeave = () => {
    this._mouseDown = false;
  };

  public handleBackfill = (item: JSX.Element) => {
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

  public filterOption = (input: string, child: JSX.Element, defaultFilter = defaultFilterFn) => {
    const value = this.state.value as string[];
    const lastValue = value[value.length - 1];
    if (!input || (lastValue && lastValue === this.state.backfillValue)) {
      return true;
    }
    let filterFn = this.props.filterOption;
    if ('filterOption' in this.props) {
      if (filterFn === true) {
        filterFn = defaultFilter.bind(this);
      }
    } else {
      filterFn = defaultFilter.bind(this);
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

  public timeoutFocus = () => {
    const { onFocus } = this.props;
    if (this.focusTimer) {
      this.clearFocusTime();
    }
    this.focusTimer = window.setTimeout(() => {
      if (onFocus) {
        onFocus();
      }
    }, 10);
  };

  public clearFocusTime = () => {
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
      this.focusTimer = null;
    }
  };

  public clearBlurTime = () => {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  };

  public clearComboboxTime = () => {
    if (this.comboboxTimer) {
      clearTimeout(this.comboboxTimer);
      this.comboboxTimer = null;
    }
  };

  public updateFocusClassName = () => {
    const rootRef = this.rootRef;
    const props = this.props;
    // avoid setState and its side effect
    if (this._focused) {
      classes(rootRef).add(`${props.prefixCls}-focused`);
    } else {
      classes(rootRef).remove(`${props.prefixCls}-focused`);
    }
  };

  public maybeFocus = (open: boolean, needFocus: boolean) => {
    if (needFocus || open) {
      const input = this.getInputDOMNode();
      const { activeElement } = document;
      if (input && (open || isMultipleOrTagsOrCombobox(this.props))) {
        if (activeElement !== input) {
          input.focus();
          this._focused = true;
        }
      } else if (activeElement !== this.selectionRef && this.selectionRef) {
        this.selectionRef.focus();
        this._focused = true;
      }
    }
  };

  public removeSelected = (
    selectedKey: string[] | string,
    e?: React.MouseEvent<HTMLSpanElement>,
  ) => {
    const props = this.props;
    if (props.disabled || this.isChildDisabled(selectedKey)) {
      return;
    }

    // Do not trigger Trigger popup
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const oldValue = this.state.value as string[];

    const value = oldValue.filter(singleValue => {
      return singleValue !== selectedKey;
    });
    const canMultiple = isMultipleOrTags(props);

    if (canMultiple) {
      let event: valueType = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey as string,
          label: this.getLabelBySingleValue(selectedKey),
        };
      }
      if (props.onDeselect) {
        props.onDeselect(event, this.getOptionBySingleValue(selectedKey));
      }
    }
    this.fireChange(value);
  };

  public openIfHasChildren = () => {
    const props = this.props;
    if (React.Children.count(props.children) || isSingleMode(props)) {
      this.setOpenState(true);
    }
  };

  public fireSelect = (value: valueType) => {
    if (this.props.onSelect) {
      this.props.onSelect(
        this.getVLBySingleValue(value) as valueType,
        this.getOptionBySingleValue(value),
      );
    }
  };

  public fireChange = (value: valueType) => {
    const props = this.props;
    if (!('value' in props)) {
      this.setState(
        {
          value,
        },
        this.forcePopupAlign,
      );
    }
    const vls = this.getVLForOnChange(value);
    const options = this.getOptionsBySingleValue(value);
    if (props.onChange) {
      props.onChange(vls, isMultipleOrTags(this.props) ? options : options[0]);
    }
  };

  public isChildDisabled = (key: string | string[]) => {
    return childrenToArray(this.props.children).some((child: React.ReactElement<any>) => {
      const childValue = getValuePropValue(child);
      return childValue === key && child.props && child.props.disabled;
    });
  };

  public forcePopupAlign = () => {
    if (!this.state.open) {
      return;
    }
    if (this.selectTriggerRef && this.selectTriggerRef.triggerRef) {
      this.selectTriggerRef.triggerRef.forcePopupAlign();
    }
  };

  public renderFilterOptions = (): { empty: boolean; options: JSX.Element[] } => {
    const { inputValue } = this.state;
    const { children, tags, notFoundContent } = this.props;
    const menuItems: JSX.Element[] = [];
    const childrenKeys: string[] = [];
    let empty = false;
    let options = this.renderFilterOptionsFromChildren(children, childrenKeys, menuItems);
    if (tags) {
      // tags value must be string
      let value = this.state.value as string[];
      value = value.filter(singleValue => {
        return (
          childrenKeys.indexOf(singleValue) === -1 &&
          (!inputValue || String(singleValue).indexOf(String(inputValue)) > -1)
        );
      });

      // sort by length
      value.sort((val1, val2) => {
        return val1.length - val2.length;
      });

      value.forEach(singleValue => {
        const key = singleValue;
        const menuItem = (
          <MenuItem
            style={UNSELECTABLE_STYLE}
            role="option"
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
      // ref: https://github.com/ant-design/ant-design/issues/14090
      if (inputValue && menuItems.every(option => getValuePropValue(option) !== inputValue)) {
        options.unshift(
          <MenuItem
            style={UNSELECTABLE_STYLE}
            role="option"
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={inputValue}
            key={inputValue}
          >
            {inputValue}
          </MenuItem>,
        );
      }
    }

    if (!options.length && notFoundContent) {
      empty = true;
      options = [
        <MenuItem
          style={UNSELECTABLE_STYLE}
          attribute={UNSELECTABLE_ATTRIBUTE}
          disabled={true}
          role="option"
          value="NOT_FOUND"
          key="NOT_FOUND"
        >
          {notFoundContent}
        </MenuItem>,
      ];
    }
    return { empty, options };
  };

  public renderFilterOptionsFromChildren = (
    children: Array<React.ReactElement<any>>,
    childrenKeys: string[],
    menuItems: JSX.Element[],
  ): JSX.Element[] => {
    const sel: JSX.Element[] = [];
    const props = this.props;
    const { inputValue } = this.state;
    const tags = props.tags;
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }
      const type = (child as React.ReactElement<any>).type as any;
      if (type.isSelectOptGroup) {
        let label = (child as React.ReactElement<any>).props.label;
        let key = (child as React.ReactElement<any>).key;
        if (!key && typeof label === 'string') {
          key = label;
        } else if (!label && key) {
          label = key;
        }

        // Match option group label
        if (
          inputValue &&
          this.filterOption(inputValue as string, child as React.ReactElement<any>)
        ) {
          const innerItems = childrenToArray((child as React.ReactElement<any>).props.children).map(
            (subChild: JSX.Element) => {
              const childValueSub = getValuePropValue(subChild) || subChild.key;
              return <MenuItem key={childValueSub} value={childValueSub} {...subChild.props} />;
            },
          );

          sel.push(
            <MenuItemGroup key={key} title={label}>
              {innerItems}
            </MenuItemGroup>,
          );

          // Not match
        } else {
          const innerItems = this.renderFilterOptionsFromChildren(
            (child as React.ReactElement<any>).props.children,
            childrenKeys,
            menuItems,
          );
          if (innerItems.length) {
            sel.push(
              <MenuItemGroup key={key} title={label}>
                {innerItems}
              </MenuItemGroup>,
            );
          }
        }

        return;
      }

      warning(
        type.isSelectOption,
        'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
          `instead of \`${type.name ||
            type.displayName ||
            (child as React.ReactElement<any>).type}\`.`,
      );

      const childValue = getValuePropValue(child);

      validateOptionValue(childValue, this.props);

      if (this.filterOption(inputValue as string, child as React.ReactElement<any>)) {
        const menuItem = (
          <MenuItem
            style={UNSELECTABLE_STYLE}
            attribute={UNSELECTABLE_ATTRIBUTE}
            value={childValue}
            key={childValue}
            role="option"
            {...(child as React.ReactElement<any>).props}
          />
        );
        sel.push(menuItem);
        menuItems.push(menuItem);
      }

      if (tags) {
        childrenKeys.push(childValue);
      }
    });

    return sel;
  };

  public renderTopControlNode = () => {
    const { open, inputValue } = this.state;
    const value = this.state.value as string[];
    const props = this.props;
    const {
      choiceTransitionName,
      prefixCls,
      maxTagTextLength,
      maxTagCount,
      showSearch,
      removeIcon,
    } = props;
    const maxTagPlaceholder = props.maxTagPlaceholder as (value: valueType) => string;
    const className = `${prefixCls}-selection__rendered`;
    // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
    let innerNode: Array<JSX.Element | null> | null | JSX.Element = null;
    if (isSingleMode(props)) {
      let selectedValue: JSX.Element | null = null;
      if (value.length) {
        let showSelectedValue = false;
        let opacity = 1;
        if (!showSearch) {
          showSelectedValue = true;
        } else if (open) {
          showSelectedValue = !inputValue;
          if (showSelectedValue) {
            opacity = 0.4;
          }
        } else {
          showSelectedValue = true;
        }
        const singleValue = value[0];
        const { label, title } = this.getOptionInfoBySingleValue(singleValue);
        selectedValue = (
          <div
            key="value"
            className={`${prefixCls}-selection-selected-value`}
            title={toTitle(title || label)}
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
      let selectedValueNodes: JSX.Element[] = [];
      let limitedCountValue = value;
      let maxTagPlaceholderEl;
      if (maxTagCount !== undefined && value.length > maxTagCount) {
        limitedCountValue = limitedCountValue.slice(0, maxTagCount);
        const omittedValues = this.getVLForOnChange(value.slice(maxTagCount, value.length));
        let content = `+ ${value.length - maxTagCount} ...`;
        if (maxTagPlaceholder) {
          content =
            typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(omittedValues)
              : maxTagPlaceholder;
        }
        maxTagPlaceholderEl = (
          <li
            style={UNSELECTABLE_STYLE}
            {...UNSELECTABLE_ATTRIBUTE}
            role="presentation"
            onMouseDown={preventDefaultEvent}
            className={`${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`}
            key="maxTagPlaceholder"
            title={toTitle(content)}
          >
            <div className={`${prefixCls}-selection__choice__content`}>{content}</div>
          </li>
        );
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
              role="presentation"
              key={singleValue || SELECT_EMPTY_VALUE_KEY}
              title={toTitle(title)}
            >
              <div className={`${prefixCls}-selection__choice__content`}>{content}</div>
              {disabled ? null : (
                <span
                  onClick={event => {
                    this.removeSelected(singleValue, event);
                  }}
                  className={`${prefixCls}-selection__choice__remove`}
                >
                  {removeIcon || <i className={`${prefixCls}-selection__choice__remove-icon`}>×</i>}
                </span>
              )}
            </li>
          );
        });
      }
      if (maxTagPlaceholderEl) {
        selectedValueNodes.push(maxTagPlaceholderEl);
      }
      selectedValueNodes.push(
        <li className={`${prefixCls}-search ${prefixCls}-search--inline`} key="__input">
          {this.getInputElement()}
        </li>,
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
        innerNode = <ul>{selectedValueNodes}</ul>;
      }
    }
    return (
      <div className={className} ref={this.saveTopCtrlRef}>
        {this.getPlaceholderElement()}
        {innerNode}
      </div>
    );
  };
  public renderArrow(multiple: boolean) {
    // showArrow : Set to true if not multiple by default but keep set value.
    const { showArrow = !multiple, loading, inputIcon, prefixCls } = this.props;

    if (!showArrow && !loading) {
      return null;
    }

    // if loading  have loading icon
    const defaultIcon = loading ? (
      <i className={`${prefixCls}-arrow-loading`} />
    ) : (
      <i className={`${prefixCls}-arrow-icon`} />
    );
    return (
      <span
        key="arrow"
        className={`${prefixCls}-arrow`}
        style={UNSELECTABLE_STYLE}
        {...UNSELECTABLE_ATTRIBUTE}
        onClick={this.onArrowClick}
      >
        {inputIcon || defaultIcon}
      </span>
    );
  }
  public renderClear() {
    const { prefixCls, allowClear, clearIcon } = this.props;
    const { inputValue } = this.state;
    const value = this.state.value as string[];
    const clear = (
      <span
        key="clear"
        className={`${prefixCls}-selection__clear`}
        onMouseDown={preventDefaultEvent}
        style={UNSELECTABLE_STYLE}
        {...UNSELECTABLE_ATTRIBUTE}
        onClick={this.onClearSelection}
      >
        {clearIcon || <i className={`${prefixCls}-selection__clear-icon`}>×</i>}
      </span>
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

  public render() {
    const props = this.props;
    const multiple = isMultipleOrTags(props);

    // Default set showArrow to true if not set (not set directly in defaultProps to handle multiple case)
    const { showArrow = true } = props;

    const state = this.state;
    const { className, disabled, prefixCls, loading } = props;
    const ctrlNode = this.renderTopControlNode();
    const { open, ariaId } = this.state;
    if (open) {
      const filterOptions = this.renderFilterOptions();
      this._empty = filterOptions.empty;
      this._options = filterOptions.options;
    }
    const realOpen = this.getRealOpenState();
    const empty = this._empty;
    const options = this._options || [];
    const dataOrAriaAttributeProps = {};
    Object.keys(props).forEach(key => {
      if (
        Object.prototype.hasOwnProperty.call(props, key) &&
        (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role')
      ) {
        dataOrAriaAttributeProps[key] = props[key];
      }
    });
    // for (const key in props) {
    //   if (
    //     Object.prototype.hasOwnProperty.call(props, key) &&
    //     (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role')
    //   ) {
    //     dataOrAriaAttributeProps[key] = props[key];
    //   }
    // }
    let extraSelectionProps = { ...dataOrAriaAttributeProps };
    if (!isMultipleOrTagsOrCombobox(props)) {
      extraSelectionProps = {
        ...extraSelectionProps,
        onKeyDown: this.onKeyDown,
        tabIndex: props.disabled ? -1 : props.tabIndex,
      };
    }
    const rootCls = {
      [className as string]: !!className,
      [prefixCls as string]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-focused`]: open || !!this._focused,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
      [`${prefixCls}-no-arrow`]: !showArrow,
      [`${prefixCls}-loading`]: !!loading,
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
        empty={empty}
        multiple={multiple}
        disabled={disabled}
        visible={realOpen}
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
        ref={this.saveSelectTriggerRef}
        menuItemSelectedIcon={props.menuItemSelectedIcon}
        dropdownRender={props.dropdownRender}
        ariaId={ariaId}
      >
        <div
          id={props.id}
          style={props.style}
          ref={this.saveRootRef}
          onBlur={this.onOuterBlur}
          onFocus={this.onOuterFocus}
          className={classnames(rootCls)}
          onMouseDown={this.markMouseDown}
          onMouseUp={this.markMouseLeave}
          onMouseOut={this.markMouseLeave}
        >
          <div
            ref={this.saveSelectionRef}
            key="selection"
            className={`${prefixCls}-selection
            ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="true"
            aria-controls={ariaId}
            aria-expanded={realOpen}
            {...extraSelectionProps}
          >
            {ctrlNode}
            {this.renderClear()}
            {this.renderArrow(!!multiple)}
          </div>
        </div>
      </SelectTrigger>
    );
  }
}

Select.displayName = 'Select';

polyfill(Select);

export default Select;
