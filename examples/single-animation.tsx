/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

function onChange(value) {
  console.log(`selected ${value}`);
}

const Test = () => (
  <div>
    <div style={{ height: 150 }} />
    <h2>Single Select</h2>

    <div style={{ width: 300 }}>
      <Select
        allowClear
        placeholder="placeholder"
        defaultValue="lucy"
        style={{ width: 500 }}
        animation="slide-up"
        showSearch
        onChange={onChange}
      >
        <Option value="jack">
          <b
            style={{
              color: 'red',
            }}
          >
            jack
          </b>
        </Option>
        <Option value="lucy">lucy</Option>
        <Option value="disabled" disabled>
          disabled
        </Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>
);

export default Test;
/* eslint-enable */
