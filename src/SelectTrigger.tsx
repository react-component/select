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
  disabled: boolean;
  visible: boolean;
  popupElement: React.ReactElement;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({
  prefixCls,
  disabled,
  visible,
  children,
  popupElement,
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
      popupClassName={`sss`}
      popupStyle={{}}
    >
      {children}
    </Trigger>
  );
};

export default SelectTrigger;
