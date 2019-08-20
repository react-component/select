import * as React from 'react';
import Trigger from 'rc-trigger';

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

export interface SelectTriggerProps {
  prefixCls: string;
  children: React.ReactElement;
  disabled: boolean;
  visible: boolean;
  popupElement: React.ReactElement;

  containerWidth: number;
  dropdownStyle: React.CSSProperties;
  dropdownClassName: string;
  dropdownMatchSelectWidth: boolean;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({
  prefixCls,
  disabled,
  visible,
  children,
  popupElement,
  containerWidth,
  dropdownStyle,
  dropdownClassName,
  dropdownMatchSelectWidth = true,
  ...props
}) => {
  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  return (
    <Trigger
      {...props}
      showAction={['click']}
      hideAction={['click']}
      popupPlacement="bottomLeft"
      builtinPlacements={BUILT_IN_PLACEMENTS}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={null}
      onPopupVisibleChange={() => {}}
      popup={popupElement}
      popupAlign={{}}
      popupVisible={visible}
      getPopupContainer={null}
      popupClassName={dropdownClassName}
      popupStyle={{
        ...dropdownStyle,
        [dropdownMatchSelectWidth ? 'width' : 'minWidth']: containerWidth,
      }}
    >
      {children}
    </Trigger>
  );
};

export default SelectTrigger;
