import Trigger, { type TriggerRef } from '@rc-component/trigger';
import type { AlignType, BuildInPlacements } from '@rc-component/trigger/lib/interface';
import { clsx } from 'clsx';
import * as React from 'react';
import type { Placement, RenderDOMFunc } from './BaseSelect';

const getBuiltInPlacements = (
  popupMatchSelectWidth: number | boolean,
): Record<string, AlignType> => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = popupMatchSelectWidth === true ? 0 : 1;
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
  popupStyle: React.CSSProperties;
  popupClassName: string;
  direction: string;
  popupMatchSelectWidth?: boolean | number;
  popupRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderDOMFunc;
  popupAlign: AlignType;
  empty: boolean;

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
    popupStyle,
    popupClassName,
    direction = 'ltr',
    placement,
    builtinPlacements,
    popupMatchSelectWidth,
    popupRender,
    popupAlign,
    getPopupContainer,
    empty,
    onPopupVisibleChange,
    onPopupMouseEnter,
    ...restProps
  } = props;

  // We still use `dropdown` className to keep compatibility
  // This is used for:
  // 1. Styles
  // 2. Animation
  // 3. Theme customization
  // Please do not modify this since it's a breaking change
  const popupPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (popupRender) {
    popupNode = popupRender(popupElement);
  }

  const mergedBuiltinPlacements = React.useMemo(
    () => builtinPlacements || getBuiltInPlacements(popupMatchSelectWidth),
    [builtinPlacements, popupMatchSelectWidth],
  );

  // ===================== Motion ======================
  const mergedTransitionName = animation ? `${popupPrefixCls}-${animation}` : transitionName;

  // =================== Popup Width ===================
  const isNumberPopupWidth = typeof popupMatchSelectWidth === 'number';

  const stretch = React.useMemo(() => {
    if (isNumberPopupWidth) {
      return null;
    }

    return popupMatchSelectWidth === false ? 'minWidth' : 'width';
  }, [popupMatchSelectWidth, isNumberPopupWidth]);

  let mergedPopupStyle = popupStyle;

  if (isNumberPopupWidth) {
    mergedPopupStyle = {
      ...popupStyle,
      width: popupMatchSelectWidth,
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
      prefixCls={popupPrefixCls}
      popupMotion={{ motionName: mergedTransitionName }}
      popup={<div onMouseEnter={onPopupMouseEnter}>{popupNode}</div>}
      ref={triggerPopupRef}
      stretch={stretch}
      popupAlign={popupAlign}
      popupVisible={visible}
      getPopupContainer={getPopupContainer}
      popupClassName={clsx(popupClassName, { [`${popupPrefixCls}-empty`]: empty })}
      popupStyle={mergedPopupStyle}
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
