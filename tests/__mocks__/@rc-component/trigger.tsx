import React from 'react';
import Trigger from '@rc-component/trigger/lib/mock';

export default React.forwardRef((props, ref) => {
  global.triggerProps = props;
  return <Trigger {...props} ref={ref} />;
});
