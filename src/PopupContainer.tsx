import * as React from 'react';

export interface PopupContainerProps {
  children: React.ReactElement;
  visible: boolean;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
}

const PopupContainer = React.memo<PopupContainerProps>(
  ({ children }) => children,
  (_, { dropdownRender, visible }) => !dropdownRender && !visible,
);

PopupContainer.displayName = 'PopupContainer';

export default PopupContainer;
