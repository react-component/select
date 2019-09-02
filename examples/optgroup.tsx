/* eslint-disable no-console */
import React from 'react';
import Select, { Option, OptGroup } from '../src';
import '../assets/index.less';

function onChange(value, option) {
  console.log(`selected ${value}`, option);
}

const Test = () => (
  <div>
    <h2>Select OptGroup</h2>
    <div style={{ width: 300 }}>
      <Select
        placeholder="placeholder"
        defaultValue="lucy"
        style={{ width: 500 }}
        onChange={onChange}
      >
        <OptGroup label="manager">
          <Option value="jack" test-prop="jack-prop">
            <b
              style={{
                color: 'red',
              }}
            >
              jack
            </b>
          </Option>
          <Option value="lucy" test-prop="lucy-prop">
            lucy
          </Option>
        </OptGroup>
        <OptGroup label="engineer">
          <Option value="yiminghe" test-prop="yiminghe-prop">
            yiminghe
          </Option>
        </OptGroup>
      </Select>
    </div>
  </div>
);

export default Test;
/* eslint-enable */
