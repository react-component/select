/* eslint-disable no-console */
import React from 'react';
import Select from '../src';
import '../assets/index.less';

export default () => {
  return (
    <Select
      getRawInputElement={() => <span>Content</span>}
      mode="multiple"
      options={[{ value: 'light' }, { value: 'bamboo' }]}
      allowClear
      placeholder="2333"
    />
  );
};
/* eslint-enable */
