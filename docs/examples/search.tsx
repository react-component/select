import React from 'react';
import Select, { Option } from '@rc-component/select';
import '../../assets/index.less';

const Demo = () => {
  return (
    <Select placeholder="placeholder" showSearch>
      <Option value="11" text="lucy">
        lucy
      </Option>
      <Option value="21" text="disabled">
        disabled
      </Option>
    </Select>
  );
};

export default Demo;
