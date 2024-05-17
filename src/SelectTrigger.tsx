import Trigger, { type TriggerRef } from '@rc-component/trigger';
import type { AlignType, BuildInPlacements } from '@rc-component/trigger/lib/interface';
import classNames from 'classnames';
import * as React from 'react';
import type { Placement, RenderDOMFunc } from './BaseSelect';

const getBuiltInPlacements = (
  dropdownMatchSelectWidth: number | boolean,
): Record<string, AlignType> => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = dropdownMatchSelectWidth === true ? 0 : 1;
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
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
  placement?: Placement;
  builtinPlacements?: BuildInPlacements;
  dropdownStyle: React.CSSProperties;
  dropdownClassName: string;
  direction: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderDOMFunc;
  dropdownAlign: AlignType;
  empty: boolean;

  getTriggerDOMNode: (node: HTMLElement) => HTMLElement;
  onPopupVisibleChange?: (visible: boolean) => void;

  onPopupMouseEnter: () => void;
}

const SelectTrigger: React.ForwardRefRenderFunction<RefTriggerProps, SelectTriggerProps> = (
  props,
  ref,
) => {
  const {
    prefixCls,
    disabled,
    visible,
    children,
    popupElement,
    animation,
    transitionName,
    dropdownStyle,
    dropdownClassName,
    direction = 'ltr',
    placement,
    builtinPlacements,
    dropdownMatchSelectWidth,
    dropdownRender,
    dropdownAlign,
    getPopupContainer,
    empty,
    getTriggerDOMNode,
    onPopupVisibleChange,
    onPopupMouseEnter,
    ...restProps
  } = props;

  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  const mergedBuiltinPlacements = React.useMemo(
    () => builtinPlacements || getBuiltInPlacements(dropdownMatchSelectWidth),
    [builtinPlacements, dropdownMatchSelectWidth],
  );

  // ===================== Motion ======================
  const mergedTransitionName = animation ? `${dropdownPrefixCls}-${animation}` : transitionName;

  // =================== Popup Width ===================
  const isNumberPopupWidth = typeof dropdownMatchSelectWidth === 'number';

  const stretch = React.useMemo(() => {
    if (isNumberPopupWidth) {
      return null;
    }

    return dropdownMatchSelectWidth === false ? 'minWidth' : 'width';
  }, [dropdownMatchSelectWidth, isNumberPopupWidth]);

  let popupStyle = dropdownStyle;

  if (isNumberPopupWidth) {
    popupStyle = {
      ...popupStyle,
      width: dropdownMatchSelectWidth,
    };
  }

  // ======================= Ref =======================
  const triggerPopupRef = React.useRef<TriggerRef>(null);

  React.useImperativeHandle(ref, () => ({
    getPopupElement: () => triggerPopupRef.current?.popupElement,
  }));

  return (
    <Trigger
      {...restProps}
      showAction={onPopupVisibleChange ? ['click'] : []}
      hideAction={onPopupVisibleChange ? ['click'] : []}
      popupPlacement={placement || (direction === 'rtl' ? 'bottomRight' : 'bottomLeft')}
      builtinPlacements={mergedBuiltinPlacements}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={mergedTransitionName}
      popup={<div onMouseEnter={onPopupMouseEnter}>{popupNode}</div>}
      ref={triggerPopupRef}
      stretch={stretch}
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

if (process.env.NODE_ENV !== 'production') {
  RefSelectTrigger.displayName = 'SelectTrigger';
}

export default RefSelectTrigger;
