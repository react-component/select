/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import * as React from 'react';
import type { BaseSelectProps } from '../BaseSelect';

export interface BaseSelectContextProps extends BaseSelectProps {
  triggerOpen: boolean;
  multiple: boolean;
  toggleOpen: (open?: boolean) => void;
}

export const BaseSelectContext = React.createContext<BaseSelectContextProps>(null);

export default function useBaseProps() {
  return React.useContext(BaseSelectContext);
}
