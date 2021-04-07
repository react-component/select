import * as React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import type { RenderDOMFunc } from './interface';

const getBuiltInPlacements = (dropdownMatchSelectWidth: number | boolean) => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = typeof dropdownMatchSelectWidth !== 'number' ? 0 : 1;

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
  direction: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderDOMFunc;
  dropdownAlign: object;
  empty: boolean;

  getTriggerDOMNode: () => HTMLElement;
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
    dropdownMatchSelectWidth = true,
    dropdownRender,
    dropdownAlign,
    getPopupContainer,
    empty,
    getTriggerDOMNode,
    ...restProps
  } = props;

  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  const builtInPlacements = React.useMemo(() => getBuiltInPlacements(dropdownMatchSelectWidth), [
    dropdownMatchSelectWidth,
  ]);

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
      showAction={[]}
      hideAction={[]}
      popupPlacement={direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
      builtinPlacements={builtInPlacements}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={mergedTransitionName}
      popup={<div ref={popupRef}>{popupNode}</div>}
      popupAlign={dropdownAlign}
      popupVisible={visible}
      getPopupContainer={getPopupContainer}
      popupClassName={classNames(dropdownClassName, {
        [`${dropdownPrefixCls}-empty`]: empty,
      })}
      popupStyle={popupStyle}
      getTriggerDOMNode={getTriggerDOMNode}
    >
      {children}
    </Trigger>
  );
};

const RefSelectTrigger = React.forwardRef<RefTriggerProps, SelectTriggerProps>(SelectTrigger);
RefSelectTrigger.displayName = 'SelectTrigger';

export default RefSelectTrigger;
