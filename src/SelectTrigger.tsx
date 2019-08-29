import * as React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import { RenderNode } from './interface';

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
  dropdownStyle: React.CSSProperties;
  dropdownClassName: string;
  dropdownMatchSelectWidth?: true | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderNode;
  dropdownAlign: object;
  empty: boolean;
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
    dropdownMatchSelectWidth = true,
    dropdownRender,
    dropdownAlign,
    getPopupContainer,
    empty,
    ...restProps
  } = props;

  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  // ===================== Motion ======================
  const mergedTransitionName = animation ? `${dropdownPrefixCls}-${animation}` : transitionName;

  // ======================= Ref =======================
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    getPopupElement: () => popupRef.current,
  }));

  return (
    <Trigger
      {...restProps}
      showAction={[]}
      hideAction={[]}
      popupPlacement="bottomLeft"
      builtinPlacements={BUILT_IN_PLACEMENTS}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={mergedTransitionName}
      popup={<div ref={popupRef}>{popupNode}</div>}
      popupAlign={dropdownAlign}
      popupVisible={visible}
      getPopupContainer={getPopupContainer}
      popupClassName={classNames(dropdownClassName, {
        [`${dropdownPrefixCls}-empty`]: empty,
      })}
      popupStyle={{
        ...dropdownStyle,
        width:
          typeof dropdownMatchSelectWidth === 'number' ? dropdownMatchSelectWidth : containerWidth,
      }}
    >
      {children}
    </Trigger>
  );
};

const RefSelectTrigger = React.forwardRef<RefTriggerProps, SelectTriggerProps>(SelectTrigger);
RefSelectTrigger.displayName = 'SelectTrigger';

export default RefSelectTrigger;
