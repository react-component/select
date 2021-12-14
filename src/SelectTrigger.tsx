import * as React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import type { Placement, RenderDOMFunc } from './BaseSelect';

const getBuiltInPlacements = (adjustX: number) => {
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
  };
};

const getAdjustX = (adjustXDependencies: Pick<SelectTriggerProps, 'autoAdjustOverflow' | 'dropdownMatchSelectWidth'>) => {
  const { autoAdjustOverflow, dropdownMatchSelectWidth } = adjustXDependencies;
  if(!!autoAdjustOverflow) return 1;
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  return typeof dropdownMatchSelectWidth !== 'number' ? 0 : 1
}

export interface RefTriggerProps {
  getPopupElement: () => HTMLDivElement;
}

export interface SelectTriggerProps {
  prefixCls: string;
  children: React.ReactElement;
  disabled: boolean;
  visible: boolean;
  popupElement: React.ReactElement;

  animation?: string;
  transitionName?: string;
  containerWidth: number;
  placement?: Placement;
  dropdownStyle: React.CSSProperties;
  dropdownClassName: string;
  direction: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderDOMFunc;
  dropdownAlign: object;
  empty: boolean;
  autoAdjustOverflow?: boolean;

  getTriggerDOMNode: () => HTMLElement;
  onPopupVisibleChange?: (visible: boolean) => void;

  onPopupMouseEnter: () => void;
}

const SelectTrigger: React.RefForwardingComponent<RefTriggerProps, SelectTriggerProps> = (
  props,
  ref,
) => {
  const {
    prefixCls,
    disabled,
    visible,
    children,
    popupElement,
    containerWidth,
    animation,
    transitionName,
    dropdownStyle,
    dropdownClassName,
    direction = 'ltr',
    placement,
    dropdownMatchSelectWidth = true,
    dropdownRender,
    dropdownAlign,
    getPopupContainer,
    empty,
    getTriggerDOMNode,
    onPopupVisibleChange,
    onPopupMouseEnter,
    autoAdjustOverflow,
    ...restProps
  } = props;

  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  const builtInPlacements = React.useMemo(
    () => getBuiltInPlacements(getAdjustX({
      autoAdjustOverflow,
      dropdownMatchSelectWidth,
    })),
    [dropdownMatchSelectWidth, autoAdjustOverflow],
  );

  // ===================== Motion ======================
  const mergedTransitionName = animation ? `${dropdownPrefixCls}-${animation}` : transitionName;

  // ======================= Ref =======================
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    getPopupElement: () => popupRef.current,
  }));

  const popupStyle: React.CSSProperties = {
    minWidth: containerWidth,
    ...dropdownStyle,
  };

  if (typeof dropdownMatchSelectWidth === 'number') {
    popupStyle.width = dropdownMatchSelectWidth;
  } else if (dropdownMatchSelectWidth) {
    popupStyle.width = containerWidth;
  }

  return (
    <Trigger
      {...restProps}
      showAction={onPopupVisibleChange ? ['click'] : []}
      hideAction={onPopupVisibleChange ? ['click'] : []}
      popupPlacement={placement || (direction === 'rtl' ? 'bottomRight' : 'bottomLeft')}
      builtinPlacements={builtInPlacements}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={mergedTransitionName}
      popup={
        <div ref={popupRef} onMouseEnter={onPopupMouseEnter}>
          {popupNode}
        </div>
      }
      popupAlign={dropdownAlign}
      popupVisible={visible}
      getPopupContainer={getPopupContainer}
      popupClassName={classNames(dropdownClassName, {
        [`${dropdownPrefixCls}-empty`]: empty,
      })}
      popupStyle={popupStyle}
      getTriggerDOMNode={getTriggerDOMNode}
      onPopupVisibleChange={onPopupVisibleChange}
    >
      {children}
    </Trigger>
  );
};

const RefSelectTrigger = React.forwardRef<RefTriggerProps, SelectTriggerProps>(SelectTrigger);
RefSelectTrigger.displayName = 'SelectTrigger';

export default RefSelectTrigger;
