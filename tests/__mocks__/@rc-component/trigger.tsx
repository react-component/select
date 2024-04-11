import React from 'react';
import Trigger from '@rc-component/trigger/lib/mock';

export default (props) => {
  global.triggerProps = props;
  return <Trigger {...props} />;
};
