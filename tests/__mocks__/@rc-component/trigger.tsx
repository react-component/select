import React from 'react';
import Trigger from '@rc-component/trigger/lib/mock';
import type { TriggerProps, TriggerRef } from '@rc-component/trigger';

export default React.forwardRef<TriggerRef, TriggerProps>((props, ref) => {
  global.triggerProps = props;
  return <Trigger {...props} ref={ref} />;
});
