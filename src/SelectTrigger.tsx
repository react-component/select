import Trigger from 'rc-trigger';
import React, { CSSProperties, UIEventHandler, MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { isSingleMode, saveRef } from './util';
import DropdownMenu, { IDropdownMenuProps } from './DropdownMenu';
import { valueType, renderSelect } from './PropTypes';

Trigger.displayName = 'Trigger';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

export interface ISelectTriggerProps extends IDropdownMenuProps {
  onPopupFocus: () => void;
  onPopupScroll: UIEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  dropdownMatchSelectWidth: boolean;
  dropdownStyle: CSSProperties;
  dropdownAlign: object;
  visible: boolean;
  combobox: boolean;
  disabled: boolean;
  showSearch: boolean;
  dropdownClassName: string;
  multiple: boolean;
  inputValue: string | string[];
  filterOption: any;
  options: any;
  prefixCls: string;
  popupClassName: string;
  children: any;
  showAction: string[];
  menuItemSelectedIcon: renderSelect;
  dropdownRender: (menu: React.ReactNode, props: Partial<ISelectTriggerProps>) => React.ReactNode;
  onDropdownVisibleChange: (value: boolean) => void;
  getPopupContainer: renderSelect;
  ariaId: string;
  value: valueType;
  transitionName: string;
  animation: string;
}
export interface ISelectTriggerState {
  dropdownWidth: number;
}
export default class SelectTrigger extends React.Component<
  Partial<ISelectTriggerProps>,
  ISelectTriggerState
> {
  static displayName: string;

  static defaultProps = {
    dropdownRender: menu => menu,
  };

  static propTypes = {
    onPopupFocus: PropTypes.func,
    onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    children: PropTypes.any,
    showAction: PropTypes.arrayOf(PropTypes.string),
    menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    dropdownRender: PropTypes.func,
    ariaId: PropTypes.string,
  };

  saveDropdownMenuRef: (ref) => void;
  saveTriggerRef: (ref) => void;
  dropdownMenuRef: DropdownMenu;
  triggerRef: Trigger;

  constructor(props) {
    super(props);

    this.saveDropdownMenuRef = saveRef(this, 'dropdownMenuRef');
    this.saveTriggerRef = saveRef(this, 'triggerRef');

    this.state = {
      dropdownWidth: null,
    };
  }

  componentDidMount() {
    this.setDropdownWidth();
  }

  componentDidUpdate() {
    this.setDropdownWidth();
  }

  setDropdownWidth = () => {
    const dom = ReactDOM.findDOMNode(this) as HTMLDivElement;
    const width = dom.offsetWidth;
    if (width !== this.state.dropdownWidth) {
      this.setState({ dropdownWidth: width });
    }
  };

  getInnerMenu = () => {
    return this.dropdownMenuRef && this.dropdownMenuRef.menuRef;
  };

  getPopupDOMNode = () => {
    return this.triggerRef.getPopupDomNode();
  };

  getDropdownElement = newProps => {
    const props = this.props;

    const { dropdownRender, ariaId } = props;

    const menuNode = (
      <DropdownMenu
        ref={this.saveDropdownMenuRef}
        {...newProps}
        ariaId={ariaId}
        prefixCls={this.getDropdownPrefixCls()}
        onMenuSelect={props.onMenuSelect}
        onMenuDeselect={props.onMenuDeselect}
        onPopupScroll={props.onPopupScroll}
        value={props.value}
        backfillValue={props.backfillValue}
        firstActiveValue={props.firstActiveValue}
        defaultActiveFirstOption={props.defaultActiveFirstOption}
        dropdownMenuStyle={props.dropdownMenuStyle}
        menuItemSelectedIcon={props.menuItemSelectedIcon}
      />
    );

    return dropdownRender(menuNode, props);
  };

  getDropdownTransitionName = () => {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  };

  getDropdownPrefixCls = () => {
    return `${this.props.prefixCls}-dropdown`;
  };

  render() {
    const { onPopupFocus, ...props } = this.props;
    const {
      multiple,
      visible,
      inputValue,
      dropdownAlign,
      disabled,
      showSearch,
      dropdownClassName,
      dropdownStyle,
      dropdownMatchSelectWidth,
    } = props;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [dropdownClassName]: !!dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    const popupElement = this.getDropdownElement({
      menuItems: props.options,
      onPopupFocus,
      multiple,
      inputValue,
      visible,
    });
    let hideAction;
    if (disabled) {
      hideAction = [];
    } else if (isSingleMode(props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    const popupStyle = { ...dropdownStyle };
    const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.state.dropdownWidth) {
      popupStyle[widthProp] = `${this.state.dropdownWidth}px`;
    }
    return (
      <Trigger
        {...props}
        showAction={disabled ? [] : this.props.showAction}
        hideAction={hideAction}
        ref={this.saveTriggerRef}
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={popupElement}
        popupAlign={dropdownAlign}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classnames(popupClassName)}
        popupStyle={popupStyle}
      >
        {props.children}
      </Trigger>
    );
  }
}

SelectTrigger.displayName = 'SelectTrigger';
