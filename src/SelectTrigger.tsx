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
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
}

const SelectTrigger: React.FC<SelectTriggerProps> = props => {
  const {
    prefixCls,
    disabled,
    visible,
    children,
    popupElement,
    containerWidth,
    dropdownStyle,
    dropdownClassName,
    dropdownMatchSelectWidth = true,
    dropdownRender,
    ...restProps
  } = props;

  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  let popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }

  return (
    <Trigger
      {...restProps}
      showAction={['click']}
      hideAction={['click']}
      popupPlacement="bottomLeft"
      builtinPlacements={BUILT_IN_PLACEMENTS}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={null}
      onPopupVisibleChange={() => {}}
      popup={popupNode}
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
